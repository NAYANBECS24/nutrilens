"use client";

import { Camera, Mic, Search } from "lucide-react";
import { useState } from "react";

import CameraCapture from "@/components/camera-capture";
import MacroRing from "@/components/macro-ring";
import VoiceRecorder from "@/components/voice-recorder";
import { useAuth } from "@/hooks/use-auth";

type ActiveModal = "camera" | "voice" | null;

export default function HomeScreen() {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  return (
    <div className="mx-auto max-w-md px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Hey, {user?.displayName?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-sm text-gray-500">Log your meals to hit today&apos;s goals</p>
        </div>
      </header>

      <MacroRing consumed={0} target={2000} label="kcal" />

      <section aria-label="Log a meal">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Log a meal
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setActiveModal("camera")}
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-green-300 bg-green-50 py-5 text-green-700 transition hover:bg-green-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            aria-label="Take a photo of your meal"
          >
            <Camera size={28} aria-hidden="true" />
            <span className="text-xs font-medium">Photo</span>
          </button>

          <button
            onClick={() => setActiveModal("voice")}
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 py-5 text-blue-700 transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="Describe your meal by voice"
          >
            <Mic size={28} aria-hidden="true" />
            <span className="text-xs font-medium">Voice</span>
          </button>

          <button
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50 py-5 text-purple-700 transition hover:bg-purple-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
            aria-label="Search for a food item"
          >
            <Search size={28} aria-hidden="true" />
            <span className="text-xs font-medium">Search</span>
          </button>
        </div>
      </section>

      <section aria-label="Today's meals" aria-live="polite">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Today
        </h2>
        <p className="rounded-xl bg-gray-50 py-8 text-center text-sm text-gray-400">
          No meals logged yet. Tap a button above to start.
        </p>
      </section>

      {activeModal === "camera" && <CameraCapture onClose={() => setActiveModal(null)} />}
      {activeModal === "voice" && <VoiceRecorder onClose={() => setActiveModal(null)} />}
    </div>
  );
}
