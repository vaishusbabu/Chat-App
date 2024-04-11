import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
    apiKey: "AIzaSyCI1t1MdvGf4C9MlcvlpVklNojimezzXJw",
    authDomain: "chatapp-42f83.firebaseapp.com",
    projectId: "chatapp-42f83",
    storageBucket: "chatapp-42f83.appspot.com",
    messagingSenderId: "394860962783",
    appId: "1:394860962783:web:715cd14269e1014f759a6a",
    measurementId: "G-3WNM6KPT3M"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const auth = getAuth();
export const db = getFirestore();
// const analytics = getAnalytics(app);