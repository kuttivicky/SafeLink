require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const axios = require("axios");

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebase-adminsdk.json"); // Download from Firebase Console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Route to Save Checklist to Firestore
app.post("/save-checklist", async (req, res) => {
    const { userId, patientInfo, checklist } = req.body;

    if (!userId || !patientInfo || !checklist) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        await db.collection("checklist_responses").add({
            userId,
            patientInfo,
            checklist,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.json({ message: "Checklist saved successfully!" });
    } catch (err) {
        console.error("Error saving checklist:", err);
        res.status(500).json({ message: "Failed to save checklist" });
    }
});

// ✅ Route to Get Checklists from Firestore
app.get("/get-checklists/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const snapshot = await db.collection("checklist_responses")
                                 .where("userId", "==", userId)
                                 .orderBy("timestamp", "desc")
                                 .get();

        if (snapshot.empty) {
            return res.json({ checklists: [] });
        }

        const checklists = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.json({ checklists });
    } catch (err) {
        console.error("Error retrieving checklists:", err);
        res.status(500).json({ message: "Failed to retrieve checklists" });
    }
});

// ✅ Route to Call Gemini API
app.post("/generate-checklist", async (req, res) => {
    const { patientInfo } = req.body;

    if (!patientInfo) {
        return res.status(400).json({ message: "Patient info is required" });
    }

    try {
        const geminiRes = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `You are a medical assistant. Generate a step-by-step patient safety checklist for the following case: ${patientInfo}`,
                            },
                        ],
                    },
                ],
            }
        );

        const checklist = geminiRes.data.candidates[0].content.parts[0].text
            .split("\n")
            .filter((line) => line.trim());

        res.json({ checklist });
    } catch (err) {
        console.error("Error calling Gemini API:", err.response?.data || err.message);
        res.status(500).json({ message: "Failed to generate checklist" });
    }
});

app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));
