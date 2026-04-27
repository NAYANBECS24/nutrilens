"use client";

import { type User } from "firebase/auth";
import { useEffect, useState } from "react";

import { subscribeToAuthState } from "@/lib/firebase/auth";

type AuthState = { user: User | null; loading: boolean };

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    // subscribeToAuthState is browser-only; safe to call inside useEffect
    const unsubscribe = subscribeToAuthState((user) => {
      setState({ user, loading: false });
    });
    return unsubscribe;
  }, []);

  return state;
}
