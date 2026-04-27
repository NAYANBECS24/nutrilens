import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length > 0) return getApp();

  const credBase64 = process.env["FIREBASE_ADMIN_CREDENTIALS_BASE64"];
  if (!credBase64) {
    throw new Error("FIREBASE_ADMIN_CREDENTIALS_BASE64 env var is not set");
  }

  const credential = JSON.parse(Buffer.from(credBase64, "base64").toString("utf8")) as object;

  return initializeApp({ credential: cert(credential as Parameters<typeof cert>[0]) });
}

export const adminApp = getAdminApp();
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
