import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVo9mXVSQPki_8BkODdpVrCsevKRPd7M4",
  authDomain: "stackd-e6d96.firebaseapp.com",
  projectId: "stackd-e6d96",
  storageBucket: "stackd-e6d96.appspot.com",
  messagingSenderId: "411877264626",
  appId: "1:411877264626:web:47c82d13bb3c891bd9546b",
  measurementId: "G-8C2RTRL7KV",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
