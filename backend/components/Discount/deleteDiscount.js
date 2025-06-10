import { database } from "../config/firebaseconfig.js";
import { ref, remove, get } from "firebase/database";

async function deleteDiscount(req, res) {
  const { discountID } = req.body;

  // Check required fields
  if (!discountID) {
    return res.status(400).json({ error: "discountID is required" });
  }

  try {
    const discountRef = ref(database, `Discounts/${discountID}`);
    const snapshot = await get(discountRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Discount not found" });
    }

    // Check for dependent Booking records
    const bookingsRef = ref(database, "Bookings");
    const bookingsSnapshot = await get(bookingsRef);
    let hasDependentBookings = false;
    bookingsSnapshot.forEach((childSnapshot) => {
      if (childSnapshot.val().discountID === parseInt(discountID)) {
        hasDependentBookings = true;
      }
    });

    if (hasDependentBookings) {
      return res.status(409).json({ error: "Cannot delete discount with associated bookings" });
    }

    await remove(discountRef);

    res.status(200).json({ message: "Discount deleted successfully", discountID });
  } catch (error) {
    console.error("Error deleting discount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { deleteDiscount };