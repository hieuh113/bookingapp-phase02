import { database } from "../config/firebaseconfig.js";
import { ref, set } from "firebase/database";
import bcrypt from "bcrypt";

async function createAccount(req, res) {
  const { username, firstName, lastName, country, phoneNumber, gender, password, email, preference, location } = req.body;

  // Check required fields
  if (!username || !firstName || !lastName || !country || !phoneNumber || !gender || !password || !email || !preference || !location) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRef = ref(database, `Users/${username}`);
    await set(userRef, {
      username,
      firstName,
      lastName,
      country,
      phoneNumber,
      gender,
      password: hashedPassword,
      email,
      createAt: new Date().toISOString(), // Adding createAt with current timestamp
      preference,
      location,
    });

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { createAccount };