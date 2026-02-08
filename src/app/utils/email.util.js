import nodemailer from "nodemailer";
import { envVars } from "../config/env.js";

export async function sendOtpEmail({ to, otp }) {
  // Configure your SMTP transport (use real credentials in production)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: envVars.SMTP_USER,
      pass: envVars.SMTP_PASS
    }
  });

  const mailOptions = {
    from: process.env.SMTP_USER || "montasirr36@gmail.com",
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`
  };

  return transporter.sendMail(mailOptions);
}
