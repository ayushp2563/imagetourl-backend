const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

const app = express();
const allowedOrigins = [
  "https://imagetourl-nine.vercel.app", // Production URL
  "http://localhost:5173", // Development URL
];

// Use CORS middleware with dynamic origin handling
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins for local development
      if (process.env.NODE_ENV === "development") {
        callback(null, true); // Allow the request
        return;
      }

      // Check if the origin is allowed for production
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Deny the request
      }
    },
    methods: ["GET", "POST", "OPTIONS"], // Allow GET, POST, and OPTIONS methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    credentials: true, // Allow cookies to be sent with requests (if applicable)
    exposedHeaders: ["Access-Control-Allow-Origin"], // Expose the Access-Control-Allow-Origin header
  })
);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    format: async (req, file) => "png", // Upload as PNG format
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage: storage });

// Define upload route
app.post(
  "https://imagetourl-backend.onrender.com",
  upload.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Image uploaded successfully, return the Cloudinary URL in JSON format
      res.json({ url: req.file.secure_url });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
