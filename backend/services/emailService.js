const nodemailer = require("nodemailer");

// Create reusable transporter object using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your gmail
    pass: process.env.EMAIL_PASS, // app password
  },
});

// ----------------------------------
// SEND EMAIL FUNCTION
// ----------------------------------
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"ProdMate Reminder" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("📧 Email sent to:", to);
  } catch (error) {
    console.error("❌ Email send error:", error);
  }
};

module.exports = sendEmail;
