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
import { createIssue } from './components/Issue/createIssue.js';
import { updateIssue } from './components/Issue/updateIssue.js';
import { listIssue } from './components/Issue/listIssue.js';
import { deleteIssue } from './components/Issue/deleteIssue.js';
import { createRoomType } from './components/RoomType/createRoomType.js';
import { listRoomType } from './components/RoomType/listRoomType.js';
import { updateRoomType } from './components/RoomType/updateRoomType.js';
import { deleteRoomType } from './components/RoomType/deleteRoomType.js';
import { createDiscount } from './components/Discount/createDiscount.js';
import { updateDiscount } from './components/Discount/updateDiscount.js';
import { listDiscount } from './components/Discount/listDiscount.js';
import { deleteDiscount } from './components/Discount/deleteDiscount.js';

config();

async function startServer() {
  const appExpress = express();
  const port = process.env.PORT || 3000;

  appExpress.use(express.json());
  appExpress.use(cors());

  appExpress.get('/', (req, res) => {
    res.send('Hello from the Express backend!');
  });

  // Account management routes
  appExpress.post('/create-account', createAccount);
  appExpress.post('/store-confirmation-code', storeConfirmationCode);
  appExpress.post('/verify-confirmation-code', verifyConfirmationCode);
  appExpress.post('/send-confirmation-email', sendConfirmationEmail);
  appExpress.post('/send-reset-email', sendResetEmail);
  appExpress.post('/reset-password', resetPassword);
  appExpress.post('/login', login);
  appExpress.post('/login/google', googleLogin);
  appExpress.post('/login/facebook', facebookLogin);

  // Issue management routes
  appExpress.post('/create-issue', createIssue);
  appExpress.post('/update-issue', updateIssue);
  appExpress.get('/list-issue', listIssue);
  appExpress.post('/delete-issue', deleteIssue);

  // Room type management route
  appExpress.post('/create-room-type', createRoomType);
  appExpress.get('/list-room-type', listRoomType);
  appExpress.post('/update-room-type', updateRoomType);
  appExpress.post('/delete-room-type', deleteRoomType);

  // Discount management routes
  appExpress.post('/create-discount', createDiscount);
  appExpress.post('/update-discount', updateDiscount);
  appExpress.get('/list-discount', listDiscount);
  appExpress.post('/delete-discount', deleteDiscount);

  

  appExpress.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
  });
}

startServer();