require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const axios = require("axios");
const bcrypt = require('bcryptjs');

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
                              text: `You are a professional medical assistant specializing in patient safety. Based on the following patient information, generate a **step-by-step safety checklist**. The checklist should:
                              1. Contain exactly 5 actionable and concise points.
                              2. Use professional and empathetic language.
                              3. Focus on ensuring patient safety and well-being.
                              4. I am the patient.

                              Patient Information: ${patientInfo}`,
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


app.post("/register", async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name || !phone) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    // Check if a user with the same email already exists
    const userQuerySnapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    if (!userQuerySnapshot.empty) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      name,
      email,
      phone,
      password: hashedPassword, // store the hashed password
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Save the new user to Firestore
    const userRef = await db.collection('users').add(userData);
    res.status(201).json({ message: 'User registered successfully.', userId: userRef.id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    // Query Firestore for the user with the matching email.
    const userQuerySnapshot = await db
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
      
    if (userQuerySnapshot.empty) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    
    const userDoc = userQuerySnapshot.docs[0];
    const userData = userDoc.data();
    
    // Compare the provided password with the stored hashed password.
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    
    // For a simple login, we just return a success message.
    res.status(200).json({ message: 'Login successful.', userId: userDoc.id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/userinfo/:userid", async (req, res) => {
  const userId = req.params.userid; // In our case, userId is the email.
  try {
    const userSnapshot = await db.collection('users')
      .where('email', '==', userId)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    res.status(200).json({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      consent: userData.consent,
    });
  } catch (error) {
    console.error('Error retrieving user info:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/patients', async (req, res) => {
  const { disease } = req.query;

  try {
    const patientsRef = db.collection('checklist_responses');

    const snapshot = await patientsRef
      .where('patientInfo', '>=', disease)
      .where('patientInfo', '<=', disease + '\uf8ff')
      .get();

    const results = snapshot.docs.map(doc => doc.data());
    res.json(results);

  } catch (error) {
    console.error('Firebase query failed:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

app.get('/patients/consent', async (req, res) => {
  const { email } = req.query;
  console.log('Email:', email);
  const userSnapshot = await db.collection('users').where('email', '==', email).limit(1).get(); // example lookup

  if (userSnapshot.empty) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userDoc = userSnapshot.docs[0];
  const userData = userDoc.data();
  
  if (userData.consent) {
    res.json({ success: true, consent: patient.consent, email: userData.email, name: userData.name, phone: userData.phone });
  } else {
    res.status(404).json({ success: false, message: 'Patient not found' });
  }
});

// PATCH /userinfo/:email/consent
app.patch('/userinfo/:email/consent', async (req, res) => {
  const email = decodeURIComponent(req.params.email);
  const { consent } = req.body;

  try {
    const snapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    const docId = snapshot.docs[0].id;
    await db.collection('users').doc(docId).update({ consent });

    return res.status(200).json({ success: true, consent });
  } catch (err) {
    console.error('Consent update error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));