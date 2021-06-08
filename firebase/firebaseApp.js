import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyCskRzVtpktIiDZoVDh30IG6bUnY2ISrGs",
    authDomain: "wedeo-44321.firebaseapp.com",
    projectId: "wedeo-44321",
    storageBucket: "wedeo-44321.appspot.com",
    messagingSenderId: "838422472751",
    appId: "1:838422472751:web:0d555fdf241e341d54beda",
    measurementId: "G-JMHQ5Q7NTF"
  };
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
//   firebase.analytics();

  
export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const googleSignIn = () => auth.signInWithPopup(googleProvider);

const facebookProvider = new firebase.auth.FacebookAuthProvider();
facebookProvider.setCustomParameters({
    'display': 'popup'
  });
export const facebookSignIn = () => auth.signInWithPopup(facebookProvider);

export default firebase;