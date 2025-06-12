import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAmReB7z4l3s3GJYvxxrsQ61E3uQnwRK7M",
  authDomain: "ai-planner-booking.firebaseapp.com",
  databaseURL: "https://ai-planner-booking-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ai-planner-booking",
  storageBucket: "ai-planner-booking.appspot.com",
  messagingSenderId: "1096530224966",
  appId: "1:1096530224966:web:21254b4b9bc3ebb31de747",
  measurementId: "G-FVHP2QZ8YZ"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

export { firebaseApp, database, storage, auth };
