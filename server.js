// const express = require("express");
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// require("dotenv").config();

// const app = express();

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Multer storage configuration for Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "uploads",
//     format: async (req, file) => "png", // Upload as PNG format
//     public_id: (req, file) => `${Date.now()}-${file.originalname}`,
//   },
// });
// const upload = multer({ storage: storage });

// // Define upload route
// app.post("/upload", upload.single("image"), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }
//     // Image uploaded successfully, return the Cloudinary URL
//     res.json({ url: req.file.path });
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

const app = express();

// Use CORS middleware to allow requests from specified origins
app.use(
  cors({
    origin: "https://imagetourl-nine.vercel.app", // Replace with your frontend URL
    methods: ["GET", "POST"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    credentials: true, // Allow cookies to be sent with requests (if applicable)
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

app.get("/", (req, res) => {
  res.send("Welcome to the Image Upload API!");
});
// Define upload route
app.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Image uploaded successfully, return the Cloudinary URL
    res.json({ url: req.file.path });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
