import { database } from "../config/firebaseconfig.js";
import { ref, update, get } from "firebase/database";

async function updateRoomType(req, res) {
  const { roomTypeID, image, priceByHour, priceByNight, priceBySection, typeName, adultNumber, childrenNumber, video, hotelID } = req.body;

  // Check required fields
  if (!roomTypeID) {
    return res.status(400).json({ error: "roomTypeID is required" });
  }

  try {
    const roomTypeRef = ref(database, `RoomTypes/${roomTypeID}`);
    const snapshot = await get(roomTypeRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Room type not found" });
    }

    const updates = {
      image: image || snapshot.val().image,
      priceByHour: priceByHour || snapshot.val().priceByHour,
      priceByNight: priceByNight || snapshot.val().priceByNight,
      priceBySection: priceBySection !== undefined ? priceBySection : snapshot.val().priceBySection,
      typeName: typeName || snapshot.val().typeName,
      adultNumber: adultNumber || snapshot.val().adultNumber,
      childrenNumber: childrenNumber || snapshot.val().childrenNumber,
      video: video || snapshot.val().video,
      hotelID: hotelID || snapshot.val().hotelID,
    };

    await update(roomTypeRef, updates);

    res.status(200).json({ message: "Room type updated successfully", roomTypeID });
  } catch (error) {
    console.error("Error updating room type:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { updateRoomType };