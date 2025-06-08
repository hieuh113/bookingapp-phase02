import { database } from "../config/firebaseconfig.js";
import { ref, set } from "firebase/database";
import bcrypt from "bcrypt";

async function createAccount(req, res) {
  const { username, password, email, phoneNumber } = req.body;

  // Check required fields
  if (!username || !password || !email || !phoneNumber) {
    return res.status(400).json({ error: "All fields including hotelId are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRef = ref(database, `Users/${username}`);
    await set(userRef, {
      username,
      password: hashedPassword,
      email,
      phoneNumber,
    });

    //valid
    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { createAccount };