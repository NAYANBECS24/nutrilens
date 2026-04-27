"use client";

import {
  type Auth,
  type User,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { firebaseApp } from "./client";

// getAuth is deferred until a browser context exists — calling it during SSR
// fails because the Firebase API key env vars are not exposed server-side.
function browserAuth(): Auth {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth cannot be called on the server");
  }
  return getAuth(firebaseApp);
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(browserAuth(), callback);
}

export async function signInWithGoogle() {
  return signInWithPopup(browserAuth(), new GoogleAuthProvider());
}

export async function signOutUser() {
  return signOut(browserAuth());
}
