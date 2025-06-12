import { database as db } from "../config/firebaseconfig.js";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";

export async function listBooking(req, res) {
    try {
        
        const UserID = req.user.uid; 

        if (!UserID) {
            return res.status(401).json({ error: "User ID not found in token." });
        }

        const bookingsRef = ref(db, 'bookings');

        
        const userBookingsQuery = query(bookingsRef, orderByChild('UserID'), equalTo(UserID));

        const snapshot = await get(userBookingsQuery);
        
        
        if (!snapshot.exists()) {
            return res.status(200).json([]); // Trả về một mảng rỗng
        }

        const bookingsData = snapshot.val();
        
        
        const userBookings = Object.keys(bookingsData).map(key => ({
            id: key, // 'key' chính là ID của booking
            ...bookingsData[key]
        }));
        
        
        return res.status(200).json(userBookings);

    } catch (error) {
        console.error("Error listing bookings:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}