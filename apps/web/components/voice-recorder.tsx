"use client";

import { Mic, MicOff, X } from "lucide-react";
import { useRef, useState } from "react";

import type { ApiResponse, MealAnalysis } from "@/lib/gemini/schemas";

interface VoiceRecorderProps {
  onClose: () => void;
}

type RecorderState = "idle" | "recording" | "processing";

export default function VoiceRecorder({ onClose }: VoiceRecorderProps) {
  const [state, setState] = useState<RecorderState>("idle");
  const [result, setResult] = useState<MealAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        await processAudio();
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setState("recording");

      // Auto-stop after 30s
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") stopRecording();
      }, 30_000);
    } catch {
      setError("Microphone access denied. Please allow microphone access.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setState("processing");
  }

  async function processAudio() {
    try {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const res = await fetch("/api/voice-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioBase64: base64, mimeType: "audio/webm" }),
      });
      const json = (await res.json()) as ApiResponse<MealAnalysis>;
      if (!json.ok) {
        setError(json.error.message);
      } else {
        setResult(json.data);
      }
    } catch {
      setError("Failed to process audio. Please try again.");
    } finally {
      setState("idle");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Voice meal logging"
      className="fixed inset-0 z-50 flex flex-col bg-black/90"
    >
      <div className="flex items-center justify-between bg-black px-4 py-3">
        <h2 className="text-white font-medium">Voice Log</h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close voice recorder"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6" aria-live="polite">
        <button
          onClick={state === "idle" ? startRecording : stopRecording}
          disabled={state === "processing"}
          className={`flex h-20 w-20 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
            state === "recording"
              ? "animate-pulse bg-red-600"
              : "bg-blue-600 hover:bg-blue-700"
          } disabled:opacity-50`}
          aria-label={state === "recording" ? "Stop recording" : "Start recording"}
        >
          {state === "recording" ? (
            <MicOff size={32} className="text-white" aria-hidden="true" />
          ) : (
            <Mic size={32} className="text-white" aria-hidden="true" />
          )}
        </button>

        <p className="text-white text-sm">
          {state === "idle" && 'Tap to speak. Try: "I had two rotis and dal tadka."'}
          {state === "recording" && "Listening… tap to stop (max 30s)"}
          {state === "processing" && "Processing with Speech-to-Text + Gemini…"}
        </p>

        {error && (
          <p role="alert" className="text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        {result && (
          <div className="w-full rounded-xl bg-white p-4 space-y-2">
            <p className="font-semibold text-gray-900">{result.total_calories_kcal} kcal</p>
            <ul className="space-y-1">
              {result.items.map((item, i) => (
                <li key={i} className="text-sm text-gray-700">
                  {item.name} — {item.calories_kcal} kcal
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
