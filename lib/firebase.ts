import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Jika env belum diisi, dashboard berjalan dalam Mode Demo (data lokal). */
export const isFirebaseConfigured = Boolean(
  config.apiKey && config.databaseURL
);

let db: Database | null = null;

export function getDb(): Database | null {
  if (!isFirebaseConfigured) return null;
  if (!db) {
    const app = getApps().length ? getApp() : initializeApp(config);
    db = getDatabase(app);
  }
  return db;
}
