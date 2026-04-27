"use client";

import { Camera, ChevronRight, Mic, ScanLine, Search, Sparkles, Utensils, Zap } from "lucide-react";
import { useState } from "react";

import CameraCapture from "@/components/camera-capture";
import MacroRing from "@/components/macro-ring";
import VoiceRecorder from "@/components/voice-recorder";
import { useAuth } from "@/hooks/use-auth";

type ActiveModal = "camera" | "voice" | null;

const coachTips = [
  "Snap an Indian thali and let Gemini estimate portions.",
  "Try logging dinner before 9 PM to build a streak.",
  "Balance rice-heavy meals with curd, dal, or paneer.",
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  return (
    <div className="mx-auto max-w-md px-4 pb-7 pt-5">
      <header className="mb-5 overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200">
        <div className="bg-[linear-gradient(135deg,#e8fff4_0%,#f7f3ff_54%,#fff4d7_100%)] px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">NutriLens daily</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Hey, {user?.displayName?.split(" ")[0] ?? "there"}
              </h1>
              <p className="mt-1 text-sm text-slate-600">Point, log, and improve one meal at a time.</p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <Sparkles size={22} aria-hidden="true" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              ["Streak", "1 day"],
              ["Goal", "2000"],
              ["Mode", "Coach"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/80 px-3 py-2 ring-1 ring-white">
                <p className="text-[11px] font-medium text-slate-500">{label}</p>
                <p className="text-sm font-bold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <MacroRing consumed={0} target={2000} label="kcal" />

      <section aria-label="Log a meal" className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Log a meal</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Multimodal
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setActiveModal("camera")}
            className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-[24px] border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            aria-label="Take a photo of your meal"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Camera size={26} aria-hidden="true" />
            </span>
            <span className="text-sm font-bold">Photo</span>
          </button>

          <button
            onClick={() => setActiveModal("voice")}
            className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-[24px] border border-sky-200 bg-sky-50 text-sky-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
            aria-label="Describe your meal by voice"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Mic size={26} aria-hidden="true" />
            </span>
            <span className="text-sm font-bold">Voice</span>
          </button>

          <button
            className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-[24px] border border-violet-200 bg-violet-50 text-violet-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700"
            aria-label="Search for a food item"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Search size={26} aria-hidden="true" />
            </span>
            <span className="text-sm font-bold">Search</span>
          </button>
        </div>
      </section>

      <section aria-label="AI coach prompts" className="mt-6">
        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <Zap size={18} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-950">Smart nudges</h2>
              <p className="text-xs text-slate-500">Built for Indian meals and quick choices.</p>
            </div>
          </div>

          <div className="space-y-2">
            {coachTips.map((tip) => (
              <div key={tip} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3">
                <ScanLine className="shrink-0 text-emerald-700" size={18} aria-hidden="true" />
                <p className="text-sm font-medium leading-snug text-slate-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Today's meals" aria-live="polite" className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Today</h2>
          <button className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200">
            View day <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-5 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-800">
            <Utensils size={24} aria-hidden="true" />
          </div>
          <p className="mt-3 text-sm font-bold text-slate-900">No meals logged yet</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500">
            Start with a photo or voice note and NutriLens will turn it into calories, macros, and a practical swap.
          </p>
        </div>
      </section>

      {activeModal === "camera" && <CameraCapture onClose={() => setActiveModal(null)} />}
      {activeModal === "voice" && <VoiceRecorder onClose={() => setActiveModal(null)} />}
    </div>
  );
}
