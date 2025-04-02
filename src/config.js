// src/config.js
module.exports = {
    PORT: process.env.PORT || 5001,
    // Replace <db_password> with your actual password and add your database name (e.g., myDatabase)
    MONGO_URI:  'mongodb+srv://101413667:101413667@comp3123-assigment1.vwhbd.mongodb.net/Assignment2?retryWrites=true&w=majority&appName=comp3123-assigment1',
    JWT_SECRET: 'your_jwt_secret'
  };
  