"use client";

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
    <div className="mx-auto max-w-md px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Settings</h1>

      {user && (
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {user.photoURL && (
            <img src={user.photoURL} alt="" width={40} height={40} className="rounded-full" />
          )}
          <div>
            <p className="font-medium text-gray-900">{user.displayName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleSignOut}
        className="w-full rounded-xl border border-red-200 py-3 text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        Sign out
      </button>
    </div>
  );
}
