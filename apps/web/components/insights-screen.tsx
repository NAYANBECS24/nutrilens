"use client";

import { BarChart2 } from "lucide-react";

export default function InsightsScreen() {
  return (
    <div className="mx-auto max-w-md px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Insights</h1>
      <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 py-16 text-gray-400">
        <BarChart2 size={48} aria-hidden="true" className="mb-3" />
        <p className="text-sm">Log meals for 7 days to see your weekly trends.</p>
      </div>
    </div>
  );
}
