"use client";

import imageCompression from "browser-image-compression";
import { X } from "lucide-react";
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
      className="fixed inset-0 z-50 flex flex-col bg-black/80"
    >
      <div className="flex items-center justify-between bg-black px-4 py-3">
        <h2 className="text-white font-medium">Photo Log</h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close photo capture"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Your meal preview" className="max-h-64 rounded-xl object-cover" />
        ) : (
          <div className="flex h-48 w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-600 text-gray-400">
            No image selected
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
          <div className="w-full rounded-xl bg-white p-4 space-y-2">
            <p className="font-semibold text-gray-900">{result.total_calories_kcal} kcal</p>
            <ul className="space-y-1">
              {result.items.map((item, i) => (
                <li key={i} className="text-sm text-gray-700">
                  {item.name} — {item.calories_kcal} kcal
                </li>
              ))}
            </ul>
            {result.notes && <p className="text-xs text-gray-500 italic">{result.notes}</p>}
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
          className="w-full rounded-xl bg-green-600 py-3 text-white font-medium hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:opacity-50"
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
