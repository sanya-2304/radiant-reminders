const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');
const fetch = require('node-fetch'); // Make sure you have 'node-fetch' installed
require('dotenv').config();

const api_url = "https://zenquotes.io/api/random";

const getQuote = async () => {
    try {
      const response = await fetch(api_url);
      const data = await response.json();
      console.log('Quote API response:', data);
  
      if (data && data.length > 0) {
        const { q, a } = data[0];
        return `${q} - ${a}`;
      } else {
        return "Keep your face always toward the sunshine—and shadows will fall behind you. - Walt Whitman";
      }
    } catch (error) {
      console.error('Error fetching quote: ', error);
      return "Keep your face always toward the sunshine—and shadows will fall behind you. - Walt Whitman";
    }
  };
  

const sendDailyQuotesEmail = async () => {
  try {
    const users = await userModel.find({});
    if (!users.length) {
      console.log('No users to send daily quotes.');
      return;
    }

    const quote = await getQuote(api_url);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (const user of users) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Daily Quote",
        html: `<b>Quote of the day: </b> <p>${quote}</p>`
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Daily quote sent to: ${user.email}`);
      } catch (err) {
        console.error(`Failed to send email to ${user.email}: `, err);
      }
    }
  } catch (error) {
    console.error('Error fetching users or sending emails: ', error);
  }
};

module.exports = {sendDailyQuotesEmail, getQuote};
