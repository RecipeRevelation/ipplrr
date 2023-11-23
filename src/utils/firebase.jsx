import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD4d4wCIsAWHIje-hIc9LBGLi02y_zj_30",
  authDomain: "recipe-revelation-3177a.firebaseapp.com",
  projectId: "recipe-revelation-3177a",
  storageBucket: "recipe-revelation-3177a.appspot.com",
  messagingSenderId: "189158246355",
  appId: "1:189158246355:web:b9b3c3d90f4481407e1126"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)