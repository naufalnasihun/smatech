// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { initializeFirestore } from "firebase/firestore"

import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBmUIXJblRGF4HTCO3hOB8MykvLOq7whUE",
  authDomain: "project-web-kelas.firebaseapp.com",
  projectId: "project-web-kelas",
  storageBucket: "project-web-kelas.appspot.com",
  messagingSenderId: "202691312352", 
  appId: "1:202691312352:web:e82e7a494e705b2a12ee85"


};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const isDev = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV;
export const db = isDev ? null : initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
