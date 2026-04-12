import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";

// ── Lazy initialisation — only init if all required env vars are present ───
// This prevents a white-screen crash when VITE_FIREBASE_* vars are not set.

const FIREBASE_CONFIG = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const isFirebaseConfigured = !!(
  FIREBASE_CONFIG.apiKey &&
  FIREBASE_CONFIG.authDomain &&
  FIREBASE_CONFIG.projectId &&
  FIREBASE_CONFIG.appId
);

let _auth = null;

function getFirebaseAuth() {
  if (!isFirebaseConfigured) return null;
  if (_auth) return _auth;
  try {
    const app = getApps().length === 0
      ? initializeApp(FIREBASE_CONFIG)
      : getApps()[0];
    _auth = getAuth(app);
    return _auth;
  } catch (e) {
    console.warn("[Firebase] Init failed:", e.message);
    return null;
  }
}

// ── Providers (created lazily too) ─────────────────────────────────────────
function getGoogleProvider() {
  const p = new GoogleAuthProvider();
  p.setCustomParameters({ prompt: "select_account" });
  return p;
}

function getGithubProvider() {
  const p = new GithubAuthProvider();
  p.addScope("user:email");
  return p;
}

// ── Helpers ────────────────────────────────────────────────────────────────
export async function signInWithGoogle() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Google sign-in is not configured. Add VITE_FIREBASE_* variables to your .env.local file.");
  const result = await signInWithPopup(auth, getGoogleProvider());
  return result.user.getIdToken();
}

export async function signInWithGithub() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("GitHub sign-in is not configured. Add VITE_FIREBASE_* variables to your .env.local file.");
  const result = await signInWithPopup(auth, getGithubProvider());
  return result.user.getIdToken();
}

export async function firebaseSignOutUser() {
  const auth = getFirebaseAuth();
  if (auth) await firebaseSignOut(auth);
}

export { isFirebaseConfigured };
