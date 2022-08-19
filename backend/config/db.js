const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `MongoDB Connected at: ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (err) {
    console.error(`MongoDB Error is: ${err.message}`.red.underline.bold);
    process.exit();
  }
};

module.exports = connectDB;
