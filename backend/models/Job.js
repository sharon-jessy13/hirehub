const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  location:    { type: String, required: true },
  type:        { type: String, enum: ['Full-time', 'Part-time', 'Remote', 'Internship'], default: 'Full-time' },
  description: { type: String, required: true },
  salary:      { type: String },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [
    {
      user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      resumePath: { type: String },
      appliedAt:  { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);