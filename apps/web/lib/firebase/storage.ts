import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { firebaseApp } from "./client";

export const storage = getStorage(firebaseApp);

/**
 * Uploads a meal photo and returns the public download URL.
 * @param uid - Firebase user UID.
 * @param mealId - Unique meal document ID.
 * @param blob - Compressed image blob.
 */
export async function uploadMealPhoto(uid: string, mealId: string, blob: Blob): Promise<string> {
  const photoRef = ref(storage, `meals/${uid}/${mealId}.jpg`);
  await uploadBytes(photoRef, blob, { contentType: "image/jpeg" });
  return getDownloadURL(photoRef);
}
