import { database } from "../config/firebaseconfig.js";
import { ref, set, runTransaction, get } from "firebase/database";

async function createDiscount(req, res) {
  const { name, amount, condition } = req.body;

  // Check required fields
  if (!name || !amount || !condition) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const discountsRef = ref(database, "Discounts");
    const snapshot = await get(discountsRef);
    let newDiscountID;

    // Check for the lowest available ID
    const usedIDs = [];
    snapshot.forEach((childSnapshot) => {
      usedIDs.push(childSnapshot.val().discountID);
    });
    usedIDs.sort((a, b) => a - b);

    const counterRef = ref(database, "lastDiscountID");
    const counterSnapshot = await get(counterRef);
    let lastID = counterSnapshot.exists() ? counterSnapshot.val() : 0;

    // Find the lowest available ID (reusing deleted ones)
    newDiscountID = 1;
    for (let i = 1; i <= lastID; i++) {
      if (!usedIDs.includes(i)) {
        newDiscountID = i;
        break;
      }
    }
    if (newDiscountID > lastID) {
      newDiscountID = lastID + 1;
      await runTransaction(counterRef, (currentValue) => (currentValue || 0) + 1);
    }

    const discountRef = ref(database, `Discounts/${newDiscountID}`);
    await set(discountRef, {
      discountID: newDiscountID,
      name,
      amount,
      condition,
    });

    res.status(201).json({ message: "Discount created successfully", discountID: newDiscountID });
  } catch (error) {
    console.error("Error creating discount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { createDiscount };