require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const user_route = require('./routes/userRoute');
const {sendDailyQuotesEmail} = require('./controllers/dailyQuote'); // Corrected import path
const cron = require('node-cron');

mongoose.connect('mongodb://localhost:27017/nodemailer-app-backend')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', user_route);

app.listen(2000, () => console.log('Server is listening on port 2000'));

// Schedule task to send daily quotes at 11:50 AM every day
cron.schedule('07 17 * * *', sendDailyQuotesEmail);