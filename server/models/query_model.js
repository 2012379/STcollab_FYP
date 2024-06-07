const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    username: {
        type: String
    }
});

const querySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    queryText: {
        type: String,
        required: true,
    },
    replies: [replySchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Query = mongoose.model("Query", querySchema);

module.exports = Query;
