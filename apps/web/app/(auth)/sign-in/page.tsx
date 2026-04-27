import type { Metadata } from "next";

import SignInForm from "@/components/sign-in-form";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white px-4"
    >
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-green-700">NutriLens</h1>
          <p className="mt-2 text-gray-500 text-sm">Point. Eat. Improve.</p>
        </div>
        <SignInForm />
      </div>
    </main>
  );
}
