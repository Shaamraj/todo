const {
  registerUserService,
  loginUserService
} = require("../services/auth.service");

const generateToken = require("../utils/generateToken");

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUserService(name, email, password);

    res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginUserService(email, password);

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };