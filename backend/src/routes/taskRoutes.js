const express = require("express");
const router = express.Router();


const {
  addTask,
  fetchTasks,
  removeTask,
  updateTask,
  editTaskText
} = require("../controllers/task.controller");

const authMiddleware = require("../middlewares/authMiddleware");

// ✅ ROUTES
router.post("/", authMiddleware, addTask);
router.get("/", authMiddleware, fetchTasks);
router.delete("/:id", authMiddleware, removeTask);
router.put("/:id", authMiddleware, updateTask);
router.put("/edit/:id", authMiddleware, editTaskText);

module.exports = router;