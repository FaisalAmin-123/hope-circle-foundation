// Import mongoose (library to connect to MongoDB)
const mongoose = require('mongoose');

// Function to connect to database
const connectDB = async () => {
  try {
    // Try to connect to MongoDB using the URL from .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // If successful, show success message
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, show error and stop the app
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

// Export so we can use it in server.js
module.exports = connectDB;