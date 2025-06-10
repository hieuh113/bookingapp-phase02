import { database } from "../config/firebaseconfig.js";
import { ref, set, runTransaction, get } from "firebase/database";

async function createRoomType(req, res) {
  const { image, priceByHour, priceByNight, priceBySection, typeName, adultNumber, childrenNumber, video, hotelID } = req.body;

  // Check required fields
  if (!image || !priceByHour || !priceByNight || !typeName || !adultNumber || !childrenNumber || !video || !hotelID) {
    return res.status(400).json({ error: "All fields except priceBySection are required" });
  }

  try {
    const roomTypesRef = ref(database, "RoomTypes");
    const snapshot = await get(roomTypesRef);
    let newRoomTypeID;

    // Check for the lowest available ID
    const usedIDs = [];
    snapshot.forEach((childSnapshot) => {
      usedIDs.push(childSnapshot.val().roomTypeID);
    });
    usedIDs.sort((a, b) => a - b);

    const counterRef = ref(database, "lastRoomTypeID");
    const counterSnapshot = await get(counterRef);
    let lastID = counterSnapshot.exists() ? counterSnapshot.val() : 0;

    // Find the lowest available ID (reusing deleted ones)
    newRoomTypeID = 1;
    for (let i = 1; i <= lastID; i++) {
      if (!usedIDs.includes(i)) {
        newRoomTypeID = i;
        break;
      }
    }
    if (newRoomTypeID > lastID) {
      newRoomTypeID = lastID + 1;
      await runTransaction(counterRef, (currentValue) => (currentValue || 0) + 1);
    }

    const roomTypeRef = ref(database, `RoomTypes/${newRoomTypeID}`);
    await set(roomTypeRef, {
      roomTypeID: newRoomTypeID,
      image,
      priceByHour,
      priceByNight,
      priceBySection: priceBySection || null,
      typeName,
      adultNumber,
      childrenNumber,
      video,
      hotelID,
    });

    res.status(201).json({ message: "Room type created successfully", roomTypeID: newRoomTypeID });
  } catch (error) {
    console.error("Error creating room type:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { createRoomType };