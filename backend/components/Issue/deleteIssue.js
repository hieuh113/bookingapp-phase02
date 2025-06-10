import { database } from "../config/firebaseconfig.js";
import { ref, remove, get } from "firebase/database";

async function deleteIssue(req, res) {
  const { issueID } = req.body;

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

    await remove(issueRef);

    res.status(200).json({ message: "Issue deleted successfully", issueID });
  } catch (error) {
    console.error("Error deleting issue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { deleteIssue };