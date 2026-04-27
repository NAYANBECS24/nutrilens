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
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white"
    >
      <ul className="flex h-16 items-center justify-around" role="list">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded",
                  active ? "text-green-700 font-semibold" : "text-gray-500 hover:text-gray-700",
                )}
              >
                <Icon size={22} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
