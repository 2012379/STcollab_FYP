const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    note: {type: String},
    description: {type: String},
    room_number: {type: Number},
})

const Notes = mongoose.model('Notes', noteSchema);

module.exports = Notes; 