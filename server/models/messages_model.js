const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  RoomCode: { type: Number, required: true },
  message: { type: String } 
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
