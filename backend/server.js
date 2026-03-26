const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(cors());

// ✅ Models
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String
});

const Todo = mongoose.model("Todo", {
  userId: String,
  text: String,
  completed: Boolean
});

// ✅ Auth Middleware
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch {
    res.json({ message: "Invalid token" });
  }
};

// ------------------ AUTH APIs ------------------

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered" });
  } catch (err) {
    console.log(err);
    res.json({ message: "Register error" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login:", email);

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.json({ message: "Login error" });
  }
});

// ------------------ TODO APIs ------------------

// ADD TODO
app.post("/api/todos", auth, async (req, res) => {
  try {
    const todo = new Todo({
      userId: req.user.id,
      text: req.body.text,
      completed: false
    });

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.json({ message: "Error adding todo" });
  }
});

// GET TODOS
app.get("/api/todos", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
  } catch (err) {
    res.json({ message: "Error fetching todos" });
  }
});

// DELETE TODO
app.delete("/api/todos/:id", auth, async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.json({ message: "Delete error" });
  }
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API running");
});

// ✅ Start Server ONLY after DB connect
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");

    app.listen(5000, () => {
      console.log("Server running");
    });

  } catch (err) {
    console.log("DB Error:", err);
  }
};

startServer();

