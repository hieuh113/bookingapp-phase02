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

config();

async function startServer() {
  const appExpress = express();
  const port = process.env.PORT || 3000;

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

  appExpress.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
  });
}

startServer();