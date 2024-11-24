const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer=require('nodemailer')
require('dotenv').config();
const {getQuote}=require('./dailyQuote')


const registerLoad = async (req, res) => {
  try {
    res.render('register');
  } catch (err) {
    console.log(err.message);
  }
};

const register = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the request body

    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).send('All fields are required');
    }

    // Hash the password
    const passHash = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: passHash,
    });

    // Save the new user
    await newUser.save();
    await sendEmail(email, name);

    // Redirect to the home page after registration
    res.redirect('/home');
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
};
const sendEmail=async (email, name)=>{
  const transporter=nodemailer.createTransport({
    service:"gmail",
    secure:true,
    port:465,
    auth:{
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  })
  const receiver={
    from: process.env.EMAIL_USER,
    to:email,
    subject:"Welcome!",
    html:`<b>Welcome ${name}.</b> We're glad to have you on board.`
  }
     try{
      let info=await transporter.sendMail(receiver);
      console.log('message sent by:', info.messageId);
     }catch(err){
      console.error('failed to send msg: ', err);
     }
}
const home = async (req, res) => {
  try {
    console.log('Fetching quote...');
    const quote = await getQuote();
    console.log('Quote fetched:', quote);
    res.render('home', { quote });
   
  } catch (err) {
    console.log(err.message);
  }
};
const newQuote = async (req, res) => {
  try {
    const quote = await getQuote();
    res.json({ quote });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Error fetching new quote');
  }
};
module.exports = {
  registerLoad,
  register,
  home, newQuote
};
