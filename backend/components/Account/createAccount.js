import {auth, database } from "../config/firebaseconfig.js";
import { ref, set } from "firebase/database";
import bcrypt from "bcrypt";
// import { createUserWithEmailAndPassword } from "firebase/auth";

async function createAccount(req, res) {
  const { username, password, email, phoneNumber } = req.body;

  // Check required fields
  if (!username || !password || !email || !phoneNumber) {
    return res.status(400).json({ error: "All fields including hotelId are required" });
  }

  try {
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: username,
      phoneNumber: phoneNumber,
    })

    const uid = userRecord.uid;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRef = ref(database, `users/${uid}`);
    await set(userRef, {
      username : username,
      password: hashedPassword,
      email: email,
      phoneNumber: phoneNumber,

    });

    //valid
    res.status(201).json({ message: "Account created successfully", uid: uid });
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      return res.status(409).json({ error: 'The email address is already in use by another account.' });
    }
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { createAccount };