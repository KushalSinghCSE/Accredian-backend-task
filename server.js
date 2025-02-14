require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows JSON data in requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define referral schema
const referralSchema = new mongoose.Schema({
  referrerName: String,
  referrerEmail: String,
  refereeName: String,
  refereeEmail: String,
});

const Referral = mongoose.model("Referral", referralSchema);

// API Route - Save Referral
app.post("/api/referrals", async (req, res) => {
  try {
    const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;
    
    if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newReferral = new Referral(req.body);
    await newReferral.save();
    
    res.status(201).json({ message: "🎉 Referral saved successfully!" });
  } catch (error) {
    console.error("❌ Error saving referral:", error);
    res.status(500).json({ error: "Error saving referral" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
