const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    room_code: {type: Number, required: true},
    task: { type: String, required: true },
    assignedTo: { type: String, required: true }, // Change the type to String
    status: { type: String, default: 'Not Completed' } 
  });  

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;