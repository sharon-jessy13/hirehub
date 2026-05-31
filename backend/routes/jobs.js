const express = require('express');
const router  = express.Router();
const Job     = require('../models/Job');
const auth    = require('../middleware/auth');
const upload  = require('../middleware/upload');
const path    = require('path');
const fs      = require('fs');

// Get all jobs (public)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single job (public)
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post a job (recruiter only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter')
      return res.status(403).json({ message: 'Only recruiters can post jobs' });

    const job = await Job.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Apply with resume upload (jobseeker only)
router.post('/:id/apply', auth, upload.single('resume'), async (req, res) => {
  try {
    console.log('User:', req.user);
    console.log('File:', req.file);

    if (req.user.role !== 'jobseeker')
      return res.status(403).json({ message: 'Only job seekers can apply' });

    if (!req.file)
      return res.status(400).json({ message: 'Please upload your resume (PDF)' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Safe check - skip entries where user is undefined
    const alreadyApplied = job.applicants.some(
      a => a.user && a.user.toString() === req.user.id
    );
    if (alreadyApplied)
      return res.status(400).json({ message: 'Already applied' });

    job.applicants.push({ user: req.user.id, resumePath: req.file.filename });
    await job.save();

    res.json({ message: 'Applied successfully!' });
  } catch (err) {
    console.error('APPLY ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// View applicants (recruiter only)
router.get('/:id/applicants', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('applicants.user', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    res.json(job.applicants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Serve resume file (auth required)
router.get('/resume/:filename', auth, (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

// Delete a job (poster only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;