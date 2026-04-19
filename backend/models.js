const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const todoSchema = new mongoose.Schema({
  todo: String,
  username: String,
});

const userModel = mongoose.model("users", userSchema);
const todoModel = mongoose.model("todos", todoSchema);

module.exports = { userModel, todoModel };
