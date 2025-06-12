
import { auth, database } from "../config/firebaseconfig.js";
import { ref, get } from "firebase/database";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "ID Token is required." });
    }

    // Dùng Admin SDK để xác thực idToken này.
    
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    
    const userRef = ref(database, `Users/${uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'User data not found in database.' });
    }
    const userData = snapshot.val();
    
    
    const payload = { uid: uid };
    const sessionToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    
    res.status(200).json({
      message: 'Login successful',
      user: userData,
      token: sessionToken, // Gửi session token của bạn về
    });

  } catch (error) {
    
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
      return res.status(401).json({ error: 'Invalid or expired ID token.' });
    }
    console.error('Error in login verification:', error);
    res.status(500).json({ error: 'Internal server error during token verification.' });
  }
};