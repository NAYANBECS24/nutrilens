import type { Metadata } from "next";

import SignInForm from "@/components/sign-in-form";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen overflow-hidden bg-[#f5f7f1] px-4 py-6 text-slate-950"
    >
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-sm flex-col justify-center">
        <div className="overflow-hidden rounded-[36px] bg-slate-950 text-white shadow-2xl shadow-emerald-950/20">
          <div className="bg-[linear-gradient(135deg,#0f2418_0%,#172554_54%,#422006_100%)] p-6">
            <div className="mb-10 flex items-center justify-between">
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">
                AI food coach
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-2xl">
                🥗
              </div>
            </div>

            <h1 className="text-5xl font-black tracking-tight">NutriLens</h1>
            <p className="mt-3 text-base font-medium text-slate-200">Point. Eat. Improve.</p>
            <p className="mt-6 text-sm leading-6 text-slate-300">
              Snap Indian meals, speak quick food logs, and get smart swaps that fit your day.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              {["Photo AI", "Voice", "Coach"].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 px-2 py-3 text-xs font-bold text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <SignInForm />
        </div>
      </div>
    </main>
  );
}
