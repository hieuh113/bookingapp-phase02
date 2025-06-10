import { database } from "../config/firebaseconfig.js";
import { ref, get } from "firebase/database";

async function listRoomType(req, res) {
  try {
    const roomTypesRef = ref(database, "RoomTypes");
    const snapshot = await get(roomTypesRef);

    if (!snapshot.exists()) {
      return res.status(200).json({ message: "No room types found", roomTypes: [] });
    }

    const roomTypes = [];
    snapshot.forEach((childSnapshot) => {
      roomTypes.push({
        roomTypeID: childSnapshot.val().roomTypeID,
        image: childSnapshot.val().image,
        priceByHour: childSnapshot.val().priceByHour,
        priceByNight: childSnapshot.val().priceByNight,
        priceBySection: childSnapshot.val().priceBySection,
        typeName: childSnapshot.val().typeName,
        adultNumber: childSnapshot.val().adultNumber,
        childrenNumber: childSnapshot.val().childrenNumber,
        video: childSnapshot.val().video,
        hotelID: childSnapshot.val().hotelID,
      });
    });

    res.status(200).json({ message: "Room types retrieved successfully", roomTypes });
  } catch (error) {
    console.error("Error listing room types:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { listRoomType };