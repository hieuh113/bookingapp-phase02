import { database as db } from "../config/firebaseconfig.js";
import { ref, get, push, set } from "firebase/database";

export async function createBooking(req, res) {
    try {
        const userID = req.user.uid;
        if (!userID) {
            return res.status(401).json({ error: "User ID not found in token." });
        }
        const {roomtype, 
            checkinTime, 
            checkoutTime, 
            adultNum, 
            childrenNumber, 
            price, 
            paymentStatus, 
            paymentType, 
            night 
        } = req.body;
        if (!roomtype || !checkinTime || !checkoutTime || !adultNum || !childrenNumber || !price || !paymentStatus || !paymentType || !night) {
            return res.status(400).json({ error: "All booking fields are required." });
        }

        const userRef = ref(db, `bookings/${userID}`);
        const userSnapshot = await get(userRef);
        if (!userSnapshot.exists()) {
            return res.status(404).json({ error: "User not found." });
        }

        const customerName = userSnapshot.val().username;

        const totalPrice = price * night;

        const bookingData = {
            roomtype: roomtype,
            checkinTime: checkinTime,
            checkoutTime: checkoutTime,
            adultNum: adultNum,
            childrenNumber: childrenNumber,
            price: price,
            paymentStatus: paymentStatus || 'Pending',
            paymentType: paymentType || 'Card',
            night: night,
            customerName: customerName,
            UserID: userID,
            bookingDate: new Date().toISOString(),
            totalPrice: totalPrice,
        };

        const bookingRef = ref(db, 'bookings');
        const newBookingRef = push(bookingRef);
        await set(newBookingRef, bookingData);
        res.status(201).json({ 
            message: "Booking created successfully!",
            bookingID: newBookingRef.key,
            username: userSnapshot.val().username,
            checkinTime: checkinTime,
            checkoutTime: checkoutTime,
            message: "----------------------",
            totalPrice: totalPrice,
            paymentStatus: paymentStatus,
            paymentType: paymentType,
        });


    }catch (error) {
        console.error("Error creating booking:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}