import { database } from "../config/firebaseconfig.js";
import { ref, update, get } from "firebase/database";

async function updateDiscount(req, res) {
  const { discountID, name, amount, condition } = req.body;

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

    const updates = {
      name: name || snapshot.val().name,
      amount: amount || snapshot.val().amount,
      condition: condition || snapshot.val().condition,
    };

    await update(discountRef, updates);

    res.status(200).json({ message: "Discount updated successfully", discountID });
  } catch (error) {
    console.error("Error updating discount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { updateDiscount };