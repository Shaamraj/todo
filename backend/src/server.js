require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");
require("./cron/reminderCron");
const sendEmail = require("./utils/sendEmail");
const startServer = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB Connected");
   
    await sendEmail(
        "youractualemail@gmail.com",
        "Server Started",
        "TaskFlow email system is working"
      );

    const PORT = process.env.PORT;
    console.log("PORT =", process.env.PORT);
   
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {

    console.log("DB Error:", err);

  }
};

startServer();