import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { firebaseApp, database, auth } from './components/config/firebaseconfig.js';
import { createAccount } from './components/Account/createAccount.js';
import { storeConfirmationCode, verifyConfirmationCode, sendConfirmationEmail } from './components/Account/confirmationCode.js';
import { resetPassword } from './components/Account/resetpassword.js';
import { sendResetEmail } from './components/Account/sendresetemail.js';
import { googleLogin, facebookLogin } from './components/Account/socialLogin.js';
import { login } from './components/Account/login.js';
import { createBooking } from './components/Booking/createBooking.js';
import { listBooking } from './components/Booking/listBooking.js';



import { verifyToken } from './components/middleware/verifyToken.js';
import {get, ref, update} from 'firebase/database';

config();

async function startServer() {
  const appExpress = express();
  const PORT = process.env.PORT || 3000;

  appExpress.use(express.json());
  appExpress.use(cors());

  appExpress.get('/', (req, res) => {
    res.send('Hello from the Express backend!');
  });

  appExpress.post('/create-account', createAccount);
  appExpress.post('/store-confirmation-code', storeConfirmationCode);
  appExpress.post('/verify-confirmation-code', verifyConfirmationCode);
  appExpress.post('/send-confirmation-email', sendConfirmationEmail);
  appExpress.post('/send-reset-email', sendResetEmail);
  appExpress.post('/reset-password', resetPassword);
  appExpress.post('/login', login);
  appExpress.post('/login/google', googleLogin);
  appExpress.post('/login/facebook', facebookLogin);
  appExpress.post('/create-booking', verifyToken, createBooking);
  appExpress.get('/my-booking', verifyToken, listBooking);


  // User profile routes
  appExpress.get('/user', verifyToken, async (req, res) => {
    try {
      const userId = req.user.uid; // Assuming the user ID is stored in the token
      const userRef = ref(database, `Users/${userId}`);
      const snapshot = await get(userRef);
 
      if (!snapshot.exists()) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userData = snapshot.val();
      res.json(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  appExpress.put('/user', verifyToken, async (req, res) => {
    try {
      const userId = req.user.uid; // Assuming the user ID is stored in the token
      const userRef = ref(database, `Users/${userId}`);
      await update(userRef, req.body);
      res.json({ message: 'User data updated successfully' });
    } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  appExpress.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running at http://192.168.0.105:${PORT}`);
  });
}

startServer();