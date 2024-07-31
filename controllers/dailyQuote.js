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
  
  const getEmailTemplate = (quote) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Daily Quote</title>
        <style>
          body {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            flex-direction: column;
            height: 100vh;
            width: 100vw;
            margin: 0;
            background-color: #0c4871;
            color: aliceblue;
          }
          .container {
            background-color: #3498db; 
            color: aliceblue;
            font-weight: 700;
            width: 1000px;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            text-align: left;
          }
          .quote {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to Radiant Reminders!</h1>
        <div class="container">
          <div class="quote">
            <p><strong>Quote of the Day:</strong> ${quote}</p>
          </div>
        </div>
        <p>Thank you for subscribing!</p>
        <h4>Now, you'll get positive reminders daily on your registered mail id.</h4>
        <footer>
          <p>Thanks for subscribing. Made by: Sanya Doda. LinkedIn ID: All rights reserved 2024.</p>
        </footer>
      </body>
      </html>
    `;
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
      const htmlContent = getEmailTemplate(quote);
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Daily Quote",
        html: htmlContent
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
