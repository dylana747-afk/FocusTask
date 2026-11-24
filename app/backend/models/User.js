const mongoose = require("mongoose");

module.exports = mongoose.model("User", new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String
}));