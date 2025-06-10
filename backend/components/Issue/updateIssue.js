import { database } from "../config/firebaseconfig.js";
import { ref, update, get } from "firebase/database";

async function updateIssue(req, res) {
  const { issueID, description, status, image } = req.body;

  // Check required fields
  if (!issueID) {
    return res.status(400).json({ error: "issueID is required" });
  }

  try {
    const issueRef = ref(database, `Issues/${issueID}`);
    const snapshot = await get(issueRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Issue not found" });
    }

    const updates = {
      description: description || snapshot.val().description,
      status: status || snapshot.val().status,
      image: image || snapshot.val().image,
      updateAt: new Date().toISOString(),
    };

    await update(issueRef, updates);

    res.status(200).json({ message: "Issue updated successfully", issueID });
  } catch (error) {
    console.error("Error updating issue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { updateIssue };