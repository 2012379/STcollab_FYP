const mongoose = require('mongoose');

const roomfileSchema = new mongoose.Schema({
    originalFileName: String,
    room_code: Number,
    Uploader_username: String, 
    file_path: String, 
});

const RoomFileModel = mongoose.model('roomFile', roomfileSchema);

module.exports = RoomFileModel;
