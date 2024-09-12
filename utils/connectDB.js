// import mongoose from "mongoose";
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); 
const connectDB = async () => {
    console.log('MONGO_URI', process.env.MONGO_URI);
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;