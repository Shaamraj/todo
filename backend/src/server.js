const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app"); // ✅ THIS IS THE FIX

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
