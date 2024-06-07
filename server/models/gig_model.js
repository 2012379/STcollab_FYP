const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  gigname: { type: String, required: true },
  aboutgig: { type: String, required: true },
  qualification: { type: String, required: true },
  skills: { type: String, required: true },
  gigfield: { type: String, enum: ['Computer Science', 'Business'], required: true },
  gigtype: { type: String, enum: ['Project', 'Research'], required: true },
  username: { type: String },
  email: { type: String },
  applicants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: { type: String },
      email: { type: String },
    }
  ]
});

const Gig = mongoose.model('Gig', gigSchema);

module.exports = Gig;