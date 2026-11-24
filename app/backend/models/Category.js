const mongoose = require("mongoose");

module.exports = mongoose.model("Category", new mongoose.Schema({
    userId: String,
    name: { type: String, required: true }
}));