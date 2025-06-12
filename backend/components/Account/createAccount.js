import { auth, database } from "../config/firebaseconfig.js";
import { ref, set } from "firebase/database";



export async function createAccount(req, res) {
  const { username, password, email, phoneNumber } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: "Username, password, and email are required" });
  }

  try {

    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: username,
      phoneNumber: phoneNumber 
    });

    const uid = userRecord.uid; 


    const userRef = ref(database, `Users/${uid}`);
    await set(userRef, {
      username: username,
      email: email,
      phoneNumber: phoneNumber || "",
      
    });


    res.status(201).json({ message: "Account created successfully", uid: uid });

  } catch (error) {

    if (error.code === 'auth/email-already-exists' || error.code === 'auth/email-already-in-use') {
      return res.status(409).json({ error: 'The email address is already in use by another account.' });
    }
    if (error.code === 'auth/invalid-phone-number') {
      return res.status(400).json({ error: 'Invalid phone number format.' });
    }
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}