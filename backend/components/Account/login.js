import { database } from "../config/firebaseconfig.js";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import bcrypt from "bcrypt";

   async function login(req, res) {
     try {
       const { email, password } = req.body;

       // Find user by email
       const usersRef = ref(database, 'Users');
       const userQuery = query(usersRef, orderByChild('email'), equalTo(email));
       const snapshot = await get(userQuery);

       if (!snapshot.exists()) {
         return res.status(404).json({ error: 'User not found' });
       }

       let userData = null;
       let username = null;
       snapshot.forEach((childSnapshot) => {
         username = childSnapshot.key;
         userData = childSnapshot.val();
       });

       // Verify password
       const isPasswordValid = await bcrypt.compare(password, userData.password);
       if (!isPasswordValid) {
         return res.status(401).json({ error: 'Invalid password' });
       }

       // Return user data (excluding password)
       res.status(200).json({
         message: 'Login successful',
         user: {
           username,
           email: userData.email,
           phoneNumber: userData.phoneNumber,
         },
       });
     } catch (err) {
       console.error('Error in login:', err.message);
       res.status(500).json({ error: 'Failed to login' });
     }
   }

export { login };