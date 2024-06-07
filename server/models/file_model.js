const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    originalFileName: String,
    uploaderUsername: String,
    uploaderUserId: {
        type : mongoose.Schema.ObjectId,
        ref : 'users'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    field: String,
    category: String,
    filePath: String,
    createdAt: String,
});

const FileModel = mongoose.model('File', fileSchema);

module.exports = FileModel;
