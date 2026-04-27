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

  return (
    <div
      className="flex items-center gap-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
      role="img"
      aria-label={`${consumed} of ${target} ${label} consumed today`}
    >
      <svg width="130" height="130" viewBox="0 0 130 130" aria-hidden="true">
        <circle cx="65" cy="65" r={RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="65"
          cy="65"
          r={RADIUS}
          fill="none"
          stroke="#16a34a"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 65 65)"
          className="transition-all duration-700"
        />
        <text x="65" y="60" textAnchor="middle" className="fill-gray-900 text-lg font-bold" fontSize="22" fontWeight="700">
          {consumed}
        </text>
        <text x="65" y="78" textAnchor="middle" className="fill-gray-400 text-xs" fontSize="11">
          {label}
        </text>
      </svg>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{remaining}</p>
        <p className="text-sm text-gray-500">{label} remaining</p>
        <p className="text-xs text-gray-400">Goal: {target} {label}</p>
      </div>
    </div>
  );
}
