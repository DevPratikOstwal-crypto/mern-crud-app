const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5050;  // ✅ Use Render's dynamic PORT

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
