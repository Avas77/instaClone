import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA9gO0oY0QRiu-S3I-YtwLP9b2LKDRJbpY",
    authDomain: "social-media-266c9.firebaseapp.com",
    databaseURL: "https://social-media-266c9.firebaseio.com",
    projectId: "social-media-266c9",
    storageBucket: "social-media-266c9.appspot.com",
    messagingSenderId: "58258260505",
    appId: "1:58258260505:web:2ae01dffd8b7e899fd6088",
    measurementId: "G-K9JWQJR501"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};