require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

const startServer = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {

    console.log("DB Error:", err);

  }
};

startServer();