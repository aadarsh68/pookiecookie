// ⚠️ IMPORTANT: Replace this object with your actual Firebase Project keys.
// You can find these in Firebase Console > Project Settings > General > Your Apps > SDK Setup and Configuration.

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC4IbOjzNqa8FGDsdWfEMNYZ6uuSbz8VUI",
    authDomain: "pookiecookie-14ae5.firebaseapp.com",
    projectId: "pookiecookie-14ae5",
    storageBucket: "pookiecookie-14ae5.firebasestorage.app",
    messagingSenderId: "1072975231186",
    appId: "1:1072975231186:web:66b17999e05452a6f9d50b",
    measurementId: "G-SY99E07HG4"
};
// Initialize Firebase
// Note: We are using the Compat libraries in index.html, so 'firebase' is available globally.
// This file simply defines the config.
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
