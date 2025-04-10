const mongoose = require("mongoose");


const chatSchema = new mongoose.Schema(
    {
        user_id: String,
        room_id: String,
        content: String,
        images: String,
        video: String,
        message: String,
        type: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,


    },
    {
        timestamps: true
    }
);
const Chat = mongoose.model('Chat', chatSchema, "chats");

module.exports = Chat;