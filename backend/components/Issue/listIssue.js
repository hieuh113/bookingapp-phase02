import { database } from "../config/firebaseconfig.js";
import { ref, get } from "firebase/database";

async function listIssue(req, res) {
  try {
    const issuesRef = ref(database, "Issues");
    const snapshot = await get(issuesRef);

    if (!snapshot.exists()) {
      return res.status(200).json({ message: "No issues found", issues: [] });
    }

    const issues = [];
    snapshot.forEach((childSnapshot) => {
      issues.push({
        issueID: childSnapshot.val().issueID,
        description: childSnapshot.val().description,
        createAt: childSnapshot.val().createAt,
        status: childSnapshot.val().status,
        image: childSnapshot.val().image,
        updateAt: childSnapshot.val().updateAt,
      });
    });

    res.status(200).json({ message: "Issues retrieved successfully", issues });
  } catch (error) {
    console.error("Error listing issues:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { listIssue };