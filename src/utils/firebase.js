import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase config comes from environment variables (see .env.example) so
// your real project keys never get hardcoded into source control.
// Vite only exposes variables prefixed with VITE_ to client code.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

/** Firestore database instance — import this wherever you need to read/write. */
export const db = getFirestore(app);

/** Firebase Auth instance — used by the admin login page to gate warranty registration. */
export const auth = getAuth(app);
