const mongoose = require("mongoose");

// MERNStackDevelopment

const connectDB = async () => {
  mongoose.connect("mongodb+srv://nethikarashwini:MERNStackDevelopment@nodejsproject.8kopg.mongodb.net/devTinder");
};

module.exports = { connectDB };
