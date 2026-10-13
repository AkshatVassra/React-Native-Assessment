/**
 * Firebase Configuration for GigTask Manager.
 *
 * Developers can replace these credentials with their own Firebase project credentials.
 * The app uses Firebase Auth REST endpoints (Identity Toolkit API) and Firebase Realtime Database
 * REST endpoints, guaranteeing 100% compatibility across iOS, Android, and Web without any
 * native binary linking headaches or Metro bundling conflicts.
 */
export const FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoTaskAppKeyForGigWorkersReview2026',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'gigtask-manager.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'gigtask-manager-app',
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || 'https://gigtask-manager-app-default-rtdb.firebaseio.com',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'gigtask-manager-app.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1029384756',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:1029384756:web:abcd1234efgh5678',
};

export const FIREBASE_AUTH_ENDPOINTS = {
  signUp: (apiKey: string) =>
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
  signInWithPassword: (apiKey: string) =>
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
  lookup: (apiKey: string) =>
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
};
