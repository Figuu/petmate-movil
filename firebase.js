// Import the functions you need from the SDKs you need
import { getApps, initializeApp, getApp } from "firebase/app";
import {
  getAuth,
  EmailAuthProvider,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3mZnKux-s9cd7gIjyeqhq7d-qQdZq6cw",
  authDomain: "distribuidos-bc599.firebaseapp.com",
  projectId: "distribuidos-bc599",
  storageBucket: "distribuidos-bc599.appspot.com",
  messagingSenderId: "732114803800",
  appId: "1:732114803800:web:930c82ea283ddb18757e2d",
};

// Initialize Firebase
let app, auth;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    console.log("Error initializing app: " + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}
const provider = new EmailAuthProvider();
const db = getFirestore();
const timestamp = serverTimestamp();

export { app, auth, provider, db, timestamp };
