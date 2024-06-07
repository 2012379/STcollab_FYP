const mongoose = require("mongoose");

const dailyGoalsSchema = new mongoose.Schema({
    room_code: {type: Number, required: true},
    goal: {type: String, required: true},
    status: {type: String, default: 'Not Completed'}
});

const dailyGoals = mongoose.model("dailyGoals", dailyGoalsSchema);

module.exports = dailyGoals;