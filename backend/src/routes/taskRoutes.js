const express = require("express");
const router = express.Router();

// ✅ CORRECT IMPORT (DESTRUCTURING)
const {
  addTask,
  fetchTasks,
  removeTask,
  updateTask
} = require("../controllers/task.controller");

const authMiddleware = require("../middlewares/authMiddleware");

// ✅ ROUTES
router.post("/", authMiddleware, addTask);
router.get("/", authMiddleware, fetchTasks);
router.delete("/:id", authMiddleware, removeTask);
router.put("/:id", authMiddleware, updateTask);

module.exports = router;