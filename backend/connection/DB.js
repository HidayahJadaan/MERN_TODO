const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
  } catch (err) {
    console.log("Connection Faild To MONGODB!!!", err);
  }
};
