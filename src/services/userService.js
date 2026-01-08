import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function createUserProfile(uid, profile) {
  const ref = doc(db, "users", uid);
  await setDoc(
    ref,
    {
      ...profile,
      createdAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function getUserProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
}
