import { database } from "../config/firebaseconfig.js";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

   async function login(req, res) {
     try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

       const usersRef = ref(database, 'Users');
       const userQuery = query(usersRef, orderByChild('email'), equalTo(email));
       const snapshot = await get(userQuery);

       if (!snapshot.exists()) {
         return res.status(404).json({ error: 'User not found' });
       }

       let userData = null;
       let uid = null;
       snapshot.forEach((childSnapshot) => {
         uid = childSnapshot.key;
         userData = childSnapshot.val();
       });
       if (!uid || !userData) {
      return res.status(500).json({ error: 'Could not retrieve user details from database.' });
    }

       // Verify password
       const isPasswordValid = await bcrypt.compare(password, userData.password);
       if (!isPasswordValid) {
         return res.status(401).json({ error: 'Invalid password' });
       }

       const payload = {uid: uid};
       const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

       // Return user data (excluding password)
       res.status(200).json({
         message: 'Login successful',
         user: {
           username: userData.username,
           email: userData.email,
           phoneNumber: userData.phoneNumber,
         },
         token: token,
       });
     } catch (err) {
       console.error('Error in login:', err.message);
       res.status(500).json({ error: 'Failed to login' });
     }
   }

export { login };