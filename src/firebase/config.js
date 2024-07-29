import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyD2k1hkght4f53Ja0IVyVRt3llkRhelx-I",
  authDomain: "meet-clone-7bb6e.firebaseapp.com",
  projectId: "meet-clone-7bb6e",
  storageBucket: "meet-clone-7bb6e.appspot.com",
  messagingSenderId: "825266747885",
  appId: "1:825266747885:web:3fd886844edd864bd80fe4"
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const auth = getAuth(app);

export { auth, firestore };
