import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const isFirebaseConfigured = Boolean(
  firebaseConfig?.apiKey?.trim() && firebaseConfig?.projectId?.trim()
);

// Safely initialize Firebase only when valid credentials are present
let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    dbInstance = firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
    authInstance = getAuth(app);
  } catch (err) {
    console.warn('Firebase initialization skipped; falling back to local demo storage:', err);
    app = null;
    dbInstance = null;
    authInstance = null;
  }
}

export const db: Firestore | null = dbInstance;
export const auth: Auth | null = authInstance;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo:
        auth?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validates connection to Firestore server when Firebase is configured.
 */
export async function testConnection(): Promise<boolean> {
  if (!isFirebaseConfigured || !db) {
    return false;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration: Client is offline.');
    } else {
      console.warn('Firestore connection check notice:', error);
    }
    return false;
  }
}

export async function ensureAuth(): Promise<FirebaseUser | null> {
  if (!isFirebaseConfigured || !auth) {
    return null;
  }
  if (auth.currentUser) {
    return auth.currentUser;
  }
  const currentAuth = auth;
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(currentAuth, async (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(currentAuth);
          resolve(cred.user);
        } catch (e) {
          // Anonymous auth is restricted/disabled by default in Firebase console; proceed smoothly
          resolve(null);
        }
      }
    });
  });
}

/**
 * Google Sign-In with popup as configured by Firebase.
 */
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase is not configured. Populate firebase-applet-config.json to enable Google Sign-In.');
  }
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err: any) {
    console.error('Google Sign-In failed:', err);
    throw err;
  }
}

/**
 * Email/Password Sign-In with Firebase Auth.
 */
export async function signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase is not configured.');
  }
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

/**
 * Email/Password Registration with Firebase Auth.
 */
export async function signUpWithEmail(email: string, password: string): Promise<FirebaseUser> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase is not configured.');
  }
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

/**
 * Send password reset email via Firebase Auth.
 */
export async function resetPasswordWithEmail(email: string): Promise<void> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase is not configured.');
  }
  await sendPasswordResetEmail(auth, email);
}

/**
 * Sign out current Firebase user.
 */
export async function signOutFirebaseUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}
