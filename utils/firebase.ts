import { FIREBASE_CONFIG, FIREBASE_VAPID_KEY } from "@/data/constants";
import { AxiosInstanceWithToken } from "@/data/instance";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

export const authAPIendpoint = "/authapi";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: FIREBASE_CONFIG.apiKey || "AIzaSyDV0L3J1GIpQWJwwQaKMuXH0EFfdirDODI",
  authDomain: FIREBASE_CONFIG.authDomain || "icc-application-43d74.firebaseapp.com",
  projectId: FIREBASE_CONFIG.projectId || "icc-application-43d74",
  storageBucket: FIREBASE_CONFIG.storageBucket || "icc-application-43d74.firebasestorage.app",
  messagingSenderId: FIREBASE_CONFIG.messagingSenderId || "1061934745237",
  appId: FIREBASE_CONFIG.appId || "1:1061934745237:web:4618d2e7f602d036cbfd9c",
  measurementId: FIREBASE_CONFIG.measurementId || "G-29DG61L68D"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: FIREBASE_VAPID_KEY,
      });
      if (token) {
        const response = await AxiosInstanceWithToken.put(`${authAPIendpoint}/updatefcm/`, {fcmToken: token});
        return response.data;
      } else {
        console.warn(
          "No registration token available. Request permission to generate one."
        );
      }
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
