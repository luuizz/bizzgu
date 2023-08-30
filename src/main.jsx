import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAXNqfrrv3q1jipxTuZ0Cuomh1YmpDwSmU",
  authDomain: "bizzgu-d8854.firebaseapp.com",
  projectId: "bizzgu-d8854",
  storageBucket: "bizzgu-d8854.appspot.com",
  messagingSenderId: "1002210483961",
  appId: "1:1002210483961:web:308cf694df6bdfeadfcc28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
