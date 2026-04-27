"use client";

import { Accessibility, Bell, LogOut, Moon, ShieldCheck, Target } from "lucide-react";
import { useRouter } from "next/navigation";

import { signOutUser } from "@/lib/firebase/auth";
import { useAuth } from "@/hooks/use-auth";

export default function SettingsScreen() {
  const { user } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOutUser();
    router.replace("/sign-in");
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-7 pt-5">
      <header className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Control center</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Tune goals, accessibility, reminders, and account state.</p>
      </header>

      {user && (
        <div className="mt-5 flex items-center gap-3 rounded-[24px] bg-slate-950 p-4 text-white shadow-xl shadow-emerald-950/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {user.photoURL && (
            <img src={user.photoURL} alt="" width={48} height={48} className="rounded-2xl" />
          )}
          <div>
            <p className="font-bold">{user.displayName || "NutriLens Demo User"}</p>
            <p className="text-sm text-slate-300">{user.email || "Anonymous demo session"}</p>
          </div>
        </div>
      )}

      <section className="mt-5 space-y-3" aria-label="Settings options">
        {[
          { label: "Daily goal", value: "2000 kcal", icon: Target, tone: "bg-emerald-100 text-emerald-800" },
          { label: "Accessibility", value: "High contrast ready", icon: Accessibility, tone: "bg-sky-100 text-sky-800" },
          { label: "Meal reminders", value: "9 PM nudge", icon: Bell, tone: "bg-amber-100 text-amber-800" },
          { label: "Theme", value: "Fresh light mode", icon: Moon, tone: "bg-violet-100 text-violet-800" },
          { label: "Privacy", value: "Own-user Firestore rules", icon: ShieldCheck, tone: "bg-rose-100 text-rose-800" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="flex items-center gap-3 rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
              <Icon size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold text-slate-950">{label}</p>
              <p className="text-sm text-slate-500">{value}</p>
            </div>
          </div>
        ))}
      </section>

      <button
        onClick={handleSignOut}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white py-4 font-bold text-red-600 shadow-sm hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <LogOut size={18} aria-hidden="true" />
        Sign out
      </button>
    </div>
  );
}
