"use client";

import imageCompression from "browser-image-compression";
import { Sparkles, X } from "lucide-react";
import { useRef, useState } from "react";

import type { ApiResponse, MealAnalysis } from "@/lib/gemini/schemas";

interface CameraCaptureProps {
  onClose: () => void;
}

export default function CameraCapture({ onClose }: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MealAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressed = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    });

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(compressed);

    await analyzeImage(compressed);
  }

  async function analyzeImage(blob: Blob) {
    setAnalyzing(true);
    setError(null);
    try {
      const base64 = await blobToBase64(blob);
      const res = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const json = (await res.json()) as ApiResponse<MealAnalysis>;
      if (!json.ok) {
        setError(json.error.message);
      } else {
        setResult(json.data);
      }
    } catch {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Capture meal photo"
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95"
    >
      <div className="flex items-center justify-between bg-slate-950 px-4 py-3">
        <h2 className="font-bold text-white">Photo Log</h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close photo capture"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Your meal preview" className="max-h-64 rounded-[28px] object-cover shadow-2xl" />
        ) : (
          <div className="flex h-56 w-full flex-col items-center justify-center rounded-[28px] border border-dashed border-white/20 bg-white/5 text-slate-300">
            <Sparkles className="mb-3 text-emerald-300" size={34} aria-hidden="true" />
            <p className="font-bold">No image selected</p>
            <p className="mt-1 text-xs text-slate-400">Snap a plate or choose a gallery photo.</p>
          </div>
        )}

        {analyzing && (
          <p aria-live="polite" className="text-white text-sm">
            Analyzing with Gemini…
          </p>
        )}

        {error && (
          <p role="alert" className="text-red-400 text-sm">
            {error}
          </p>
        )}

        {result && (
          <div className="w-full space-y-3 rounded-[28px] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">AI estimate</p>
              <p className="rounded-full bg-slate-950 px-3 py-1 text-sm font-black text-white">
                {result.total_calories_kcal} kcal
              </p>
            </div>
            <ul className="space-y-1">
              {result.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <span className="font-semibold">{item.name}</span>
                  <span>{item.calories_kcal} kcal</span>
                </li>
              ))}
            </ul>
            {result.notes && <p className="text-xs leading-5 text-slate-500">{result.notes}</p>}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Select meal photo"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={analyzing}
          className="w-full rounded-2xl bg-emerald-500 py-4 font-black text-slate-950 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:opacity-50"
        >
          {preview ? "Retake" : "Take Photo / Choose Image"}
        </button>
      </div>
    </div>
  );
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
