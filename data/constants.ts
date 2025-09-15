export const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_DJANGO_WEBSOCKET_URL;
export const FIREBASE_VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPIDKEY;
export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
export const COOKIE_NAME = process.env.COOKIE_NAME || "iccapplication_cookie";
export const ORGANIZATION_ID = process.env.NEXT_PUBLIC_ORGANIZATION_ID || "1";
export const RESEND_API_KEY = process.env.NEXT_PUBLIC_RESEND_API_KEY || "";
