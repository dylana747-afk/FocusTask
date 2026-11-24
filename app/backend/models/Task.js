const mongoose = require("mongoose");

module.exports = mongoose.model("Task", new mongoose.Schema({
    userId: String,

    title: String,
    description: String,

    category: String,

    status: {
        type: String,
        default: "à faire"
    },

    priority: {
        type: String,
        default: "medium"
    },

    deadline: {
        type: Date
    }
}));