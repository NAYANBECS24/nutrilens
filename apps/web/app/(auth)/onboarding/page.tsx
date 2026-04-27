import type { Metadata } from "next";

import OnboardingWizard from "@/components/onboarding-wizard";

export const metadata: Metadata = { title: "Set Up Your Profile" };

export default function OnboardingPage() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Let&apos;s personalize NutriLens</h1>
        <OnboardingWizard />
      </div>
    </main>
  );
}
