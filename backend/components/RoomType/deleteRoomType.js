import { database } from "../config/firebaseconfig.js";
import { ref, remove, get } from "firebase/database";

async function deleteRoomType(req, res) {
  const { roomTypeID } = req.body;

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

    await remove(roomTypeRef);

    res.status(200).json({ message: "Room type deleted successfully", roomTypeID });
  } catch (error) {
    console.error("Error deleting room type:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { deleteRoomType };