"use client";

import { BarChart2, MessageCircle, Settings, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Log", icon: Utensils },
  { href: "/coach", label: "Coach", icon: MessageCircle },
  { href: "/insights", label: "Insights", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/95 px-3 pb-2 pt-1 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur"
    >
      <ul className="mx-auto flex h-16 max-w-md items-center justify-between" role="list">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "mx-auto flex min-h-12 w-full max-w-[88px] flex-col items-center justify-center gap-1 rounded-2xl px-2 text-xs transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700",
                  active
                    ? "bg-emerald-900 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
                )}
              >
                <Icon size={21} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
