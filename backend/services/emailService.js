import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your smtp provider
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail Address
    pass: process.env.EMAIL_PASS  // Your Gmail APP PASSWORD (Not your normal password)
  }
});

export const sendWelcomeEmail = async (email, name, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Smart Medical System - Login Details',
    html: `
      <h3>Welcome, ${name}!</h3>
      <p>Your medical profile has been created.</p>
      <p><strong>Login Details:</strong></p>
      <ul>
        <li>Email: ${email}</li>
        <li>Temporary Password: ${password}</li>
      </ul>
      <p>Please login and change your password immediately.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome Email Sent to ' + email);
  } catch (error) {
    console.error('Email Error:', error.message);
  }
};