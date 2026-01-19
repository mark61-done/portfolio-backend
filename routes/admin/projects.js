const express = require('express');
const router = express.Router();
const Project = require('../../models/project');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/projects');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// POST create project
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, technologies, githubUrl, liveUrl, featured, category } = req.body;
    if (!title || !description) return res.status(400).json({ success: false, message: 'Title & description required' });

    const project = new Project({
      title,
      description,
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(t => t.trim()) : []),
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      featured: featured === 'true' || featured === true,
      category: category || 'web',
      image: req.file ? `/uploads/projects/${req.file.filename}` : null
    });

    await project.save();
    res.status(201).json({ success: true, message: 'Project created', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Creation failed', error: error.message });
  }
});

// PUT update project
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const updatedData = { ...req.body };
    if (req.file) updatedData.image = `/uploads/projects/${req.file.filename}`;
    if (updatedData.technologies && !Array.isArray(updatedData.technologies)) updatedData.technologies = updatedData.technologies.split(',').map(t => t.trim());

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
    res.json({ success: true, message: 'Project updated', data: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Deletion failed', error: error.message });
  }
});

router.get('/count', async (req, res) => {
  try {
    const count = await Project.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch project count' });
  }
});


module.exports = router;
