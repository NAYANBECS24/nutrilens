"use client";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface MacroRingProps {
  consumed: number;
  target: number;
  label: string;
}

export default function MacroRing({ consumed, target, label }: MacroRingProps) {
  const pct = target > 0 ? Math.min(consumed / target, 1) : 0;
  const offset = CIRCUMFERENCE * (1 - pct);
  const remaining = Math.max(target - consumed, 0);
  const percentLabel = Math.round(pct * 100);

  return (
    <div
      className="overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-xl shadow-emerald-950/10"
      role="img"
      aria-label={`${consumed} of ${target} ${label} consumed today`}
    >
      <div className="bg-[linear-gradient(135deg,#0f2418_0%,#172554_52%,#3b2f12_100%)] p-5">
        <div className="flex items-center gap-5">
          <svg
            width="132"
            height="132"
            viewBox="0 0 130 130"
            aria-hidden="true"
            className="shrink-0"
          >
            <circle cx="65" cy="65" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="11" />
            <circle
              cx="65"
              cy="65"
              r={RADIUS}
              fill="none"
              stroke="#9be15d"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform="rotate(-90 65 65)"
              className="transition-all duration-700"
            />
            <text x="65" y="59" textAnchor="middle" fill="#ffffff" fontSize="24" fontWeight="800">
              {consumed}
            </text>
            <text x="65" y="78" textAnchor="middle" fill="#cbd5e1" fontSize="11">
              {label}
            </text>
          </svg>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-emerald-100">Today&apos;s fuel</p>
            <p className="mt-1 text-4xl font-black tracking-tight">{remaining}</p>
            <p className="text-sm text-slate-200">{label} remaining</p>
            <div className="mt-4 h-2 rounded-full bg-white/15">
              <div
                className="h-2 rounded-full bg-[#9be15d] transition-all duration-700"
                style={{ width: `${percentLabel}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-300">
              {percentLabel}% used of {target} {label}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          {[
            ["Protein", "0g", "#c4b5fd"],
            ["Carbs", "0g", "#93c5fd"],
            ["Fat", "0g", "#fbbf24"],
          ].map(([name, value, color]) => (
            <div key={name} className="rounded-2xl bg-white/10 px-2 py-3 ring-1 ring-white/10">
              <div className="mx-auto mb-1 h-1.5 w-8 rounded-full" style={{ backgroundColor: color }} />
              <p className="text-sm font-bold">{value}</p>
              <p className="text-[11px] text-slate-300">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
