const Task = require("../models/Task");

// CREATE
const createTask = async (userId, text,dueDate) => {
  if (!text) throw new Error("Task text required");

  const task = await Task.create({ userId, text, dueDate});
  return task;
};

// READ
const getTasks = async (userId) => {
  return await Task.find({ userId }).sort({ createdAt: -1 });
};

// DELETE
const deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, userId });

  if (!task) throw new Error("Task not found or unauthorized");

  return task;
};

// UPDATE
const toggleTask = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });

  if (!task) throw new Error("Task not found");

  task.completed = !task.completed;
  await task.save();

  return task;
};
const editTask = async (taskId, userId, text, dueDate) => {
  const task = await Task.findOne({
    _id: taskId,
    userId
  });

  if (!task) {
    throw new Error("Task not found");
  }

  task.text = text;
  task.dueDate = dueDate;
  await task.save();

  return task;
};


module.exports = {
  createTask,
  getTasks,
  deleteTask,
  toggleTask,
  editTask
};