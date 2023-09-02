import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAXNqfrrv3q1jipxTuZ0Cuomh1YmpDwSmU",
    authDomain: "bizzgu-d8854.firebaseapp.com",
    projectId: "bizzgu-d8854",
    storageBucket: "bizzgu-d8854.appspot.com",
    messagingSenderId: "1002210483961",
    appId: "1:1002210483961:web:308cf694df6bdfeadfcc28"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };