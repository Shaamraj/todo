const express = require("express");
const cors = require("cors");
console.log("APP.JS LOADED");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://todo-ten-alpha-58.vercel.app"
    ]
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("TaskFlow API is running...");
});

module.exports = app;