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
    status: {
        type: String,
        enum: ["Processing", "Pending", "Completed"],
        default: "Pending"
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, { timestamps: true })

module.exports = mongoose.model("Task", userSchema);