const {
  createTask,
  getTasks,
  deleteTask,
  toggleTask,
  editTask
} = require("../services/task.service");

// ADD TASK
const addTask = async (req, res) => {
  try {

    const { text, dueDate } = req.body;

    const task = await createTask(
      req.user.id,
      text,
      dueDate
    );

    res.status(201).json(task);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }
};

// GET TASKS
const fetchTasks = async (req, res) => {
  try {
    const tasks = await getTasks(req.user.id);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TASK
const removeTask = async (req, res) => {
  try {
    await deleteTask(req.params.id, req.user.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// TOGGLE TASK
const updateTask = async (req, res) => {
  try {
    const task = await toggleTask(req.params.id, req.user.id);
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//EDIT TASK
const editTaskText = async (req, res) => {
  try {
    const task = await editTask(
      req.params.id,
      req.user.id,
      req.body.text
    );

    res.json(task);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  addTask,
  fetchTasks,
  removeTask,
  updateTask,
  editTaskText
};