const nodemailer = require("nodemailer");
console.log("=== BREVO FILE LOADED ===");
console.log("BREVO_USER =", process.env.BREVO_USER);
console.log("BREVO_PASS exists =", !!process.env.BREVO_PASS);
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

transporter.verify((error) => {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("SMTP Ready");
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.BREVO_USER,
      to,
      subject,
      text
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email error:", error);
  }
};

module.exports = sendEmail;