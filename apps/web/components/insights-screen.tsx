"use client";

import { Award, BarChart2, Flame, Leaf, TrendingUp } from "lucide-react";

const week = [
  { day: "Mon", kcal: 68 },
  { day: "Tue", kcal: 84 },
  { day: "Wed", kcal: 55 },
  { day: "Thu", kcal: 72 },
  { day: "Fri", kcal: 91 },
  { day: "Sat", kcal: 64 },
  { day: "Sun", kcal: 78 },
];

export default function InsightsScreen() {
  return (
    <div className="mx-auto max-w-md px-4 pb-7 pt-5">
      <header className="rounded-[28px] bg-slate-950 p-5 text-white shadow-xl shadow-emerald-950/10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">Weekly intelligence</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight">Insights</h1>
        <p className="mt-1 text-sm text-slate-300">
          See patterns, not guilt. Your meals become signals for better choices.
        </p>
      </header>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { label: "Streak", value: "1", icon: Flame, tone: "bg-amber-100 text-amber-800" },
          { label: "Protein", value: "0g", icon: Award, tone: "bg-violet-100 text-violet-800" },
          { label: "Fiber", value: "0g", icon: Leaf, tone: "bg-emerald-100 text-emerald-800" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-slate-200">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-2xl ${tone}`}>
              <Icon size={17} aria-hidden="true" />
            </div>
            <p className="text-xl font-black text-slate-950">{value}</p>
            <p className="text-xs font-medium text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <section aria-label="Calorie trend" className="mt-5 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Calories</h2>
            <p className="mt-1 text-sm text-slate-500">Preview updates as meals are logged.</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-800">
            <TrendingUp size={19} aria-hidden="true" />
          </div>
        </div>

        <div className="flex h-40 items-end gap-2 rounded-3xl bg-slate-50 px-3 pb-3 pt-5">
          {week.map((item) => (
            <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-28 w-full items-end rounded-full bg-white">
                <div
                  className="w-full rounded-full bg-[linear-gradient(180deg,#34d399,#0f766e)]"
                  style={{ height: `${item.kcal}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-500">{item.day}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Coach insight" className="mt-5 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
            <BarChart2 size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-black text-slate-950">Trend ready</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Log meals for a few days and this screen will show calorie rhythm, macro balance,
              streaks, and high-impact swaps.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
