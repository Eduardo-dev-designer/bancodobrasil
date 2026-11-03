import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Substitua pelos dados do seu projeto Firebase:
// Firebase Console > Configurações do projeto > Seus apps > Aplicativo da Web.
const firebaseConfig = {
apiKey: "AIzaSyBQkVkJY1jnXQeXrvzmXGA55cicQu8ulKc",
  authDomain: "bancodobrazil-a7374.firebaseapp.com",
  databaseURL: "https://bancodobrazil-a7374-default-rtdb.firebaseio.com",
  projectId: "bancodobrazil-a7374",
  storageBucket: "bancodobrazil-a7374.firebasestorage.app",
  messagingSenderId: "337965993109",
  appId: "1:337965993109:web:374c1d54ea97c132e71f9c",
  databaseURL:"https://bancodobrazil-a7374-default-rtdb.firebaseio.com/",
  measurementId: "G-4T30VM76MZ"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
