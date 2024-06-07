const mongoose = require("mongoose");

const ToDoListSchemea = new mongoose.Schema({
    room_code: {type: Number, required: true},
    ToDo: {type: String, required: true},
    status: {type: String, default: 'Not Completed'}
});

const ToDoList = mongoose.model("ToDoList", ToDoListSchemea);

module.exports = ToDoList;