const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    user: {
        type: String,
        default: [String]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("Task", userSchema);