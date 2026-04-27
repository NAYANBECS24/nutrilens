import {
  Timestamp,
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { firebaseApp } from "./client";

export const db = getFirestore(firebaseApp);

export { Timestamp };

export const userDocRef = (uid: string) => doc(db, "users", uid);

export const mealsColRef = (uid: string) => collection(db, "users", uid, "meals");

export const mealDocRef = (uid: string, mealId: string) =>
  doc(db, "users", uid, "meals", mealId);

export const mealsForDateQuery = (uid: string, dateStr: string) =>
  query(
    mealsColRef(uid),
    where("dateStr", "==", dateStr),
    orderBy("createdAt", "asc"),
  );

export const threadsColRef = (uid: string) => collection(db, "users", uid, "threads");

export const messagesColRef = (uid: string, threadId: string) =>
  collection(db, "users", uid, "threads", threadId, "messages");
