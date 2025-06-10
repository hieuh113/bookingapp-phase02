import { database } from "../config/firebaseconfig.js";
import { ref, get } from "firebase/database";

async function listDiscount(req, res) {
  try {
    const discountsRef = ref(database, "Discounts");
    const snapshot = await get(discountsRef);

    if (!snapshot.exists()) {
      return res.status(200).json({ message: "No discounts found", discounts: [] });
    }

    const discounts = [];
    snapshot.forEach((childSnapshot) => {
      discounts.push({
        discountID: childSnapshot.val().discountID,
        name: childSnapshot.val().name,
        amount: childSnapshot.val().amount,
        condition: childSnapshot.val().condition,
      });
    });

    res.status(200).json({ message: "Discounts retrieved successfully", discounts });
  } catch (error) {
    console.error("Error retrieving discounts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { listDiscount };