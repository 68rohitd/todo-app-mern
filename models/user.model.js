const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  displayName: { type: String },
  history: { type: Array },
  taskId: { type: Array },
  inviteList: { type: Array },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
