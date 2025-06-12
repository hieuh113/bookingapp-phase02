import { auth, database } from "../config/firebaseconfig.js";
import { ref, set } from "firebase/database";

// Lưu ý: Chúng ta không cần bcrypt ở đây nữa vì Firebase Auth sẽ tự xử lý
// việc băm và bảo mật mật khẩu một cách an toàn.

export async function createAccount(req, res) {
  const { username, password, email, phoneNumber } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: "Username, password, and email are required" });
  }

  try {
    // BƯỚC 1: TẠO USER TRONG FIREBASE AUTHENTICATION
    // Hàm này sẽ tạo một user mới với email và password.
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: username,
      phoneNumber: phoneNumber // Đảm bảo số điện thoại đúng định dạng E.164
    });

    const uid = userRecord.uid; // Lấy UID duy nhất của user vừa được tạo

    // BƯỚC 2: LƯU THÔNG TIN BỔ SUNG VÀO REALTIME DATABASE
    // Dùng UID vừa có được làm key (khóa) cho người dùng
    const userRef = ref(database, `Users/${uid}`);
    await set(userRef, {
      username: username,
      email: email,
      phoneNumber: phoneNumber || "",
      // Không cần lưu password ở đây, Firebase Authentication đã quản lý nó an toàn.
    });

    // Trả về thông báo thành công
    res.status(201).json({ message: "Account created successfully", uid: uid });

  } catch (error) {
    // Xử lý các lỗi phổ biến từ Firebase
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