import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyB3VJHHvZlm4pw81_kjGTmuECJnn9DFSLQ",
  authDomain: "batman-b33de.firebaseapp.com",
  projectId: "batman-b33de",
  storageBucket: "batman-b33de.appspot.com",
  messagingSenderId: "572824283341",
  appId: "1:572824283341:web:70f7d8be2d1416dc59a184",
  measurementId: "G-1TRL1F5J7W"
};


const app = initializeApp(firebaseConfig);
const fireDb = getFirestore(app)

export{app,fireDb}