import type { Metadata } from "next";

import NutriChat from "@/components/nutri-chat";

export const metadata: Metadata = { title: "Coach" };

export default function CoachPage() {
  return <NutriChat />;
}
