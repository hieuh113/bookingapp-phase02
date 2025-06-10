import { database } from "../config/firebaseconfig.js";
import { ref, set, runTransaction, get } from "firebase/database";

async function createIssue(req, res) {
  const { description, status, image } = req.body;

  // Check required fields
  if (!description || !status || !image) {
    return res.status(400).json({ error: "All fields (description, status, image) are required" });
  }

  try {
    const issuesRef = ref(database, "Issues");
    const snapshot = await get(issuesRef);
    let newIssueID;

    // Check for the lowest available ID
    const usedIDs = [];
    snapshot.forEach((childSnapshot) => {
      usedIDs.push(childSnapshot.val().issueID);
    });
    usedIDs.sort((a, b) => a - b);

    const counterRef = ref(database, "lastIssueID");
    const counterSnapshot = await get(counterRef);
    let lastID = counterSnapshot.exists() ? counterSnapshot.val() : 0;

    // Find the lowest available ID (reusing deleted ones)
    newIssueID = 1;
    for (let i = 1; i <= lastID; i++) {
      if (!usedIDs.includes(i)) {
        newIssueID = i;
        break;
      }
    }
    if (newIssueID > lastID) {
      newIssueID = lastID + 1;
      await runTransaction(counterRef, (currentValue) => (currentValue || 0) + 1);
    }

    const issueRef = ref(database, `Issues/${newIssueID}`);
    await set(issueRef, {
      issueID: newIssueID,
      description,
      createAt: new Date().toISOString(),
      status,
      image,
      updateAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "Issue created successfully", issueID: newIssueID });
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { createIssue };