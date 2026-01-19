const upload = require('../../middleware/upload');

router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('📤 POST /admin/projects - Request received');
    console.log('📤 Content-Type:', req.headers['content-type']);
    
    console.log('📤 File:', req.file);
    console.log('📤 Body:', req.body);

    if (!req.body.title || !req.body.description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    let technologies = [];

    if (req.body.technologies) {
      try {
        technologies = JSON.parse(req.body.technologies);
      } catch (e) {
        technologies = req.body.technologies
          .split(',')
          .map(t => t.trim());
      }
    }

    const projectData = {
      title: req.body.title,
      description: req.body.description,
      technologies,
      githubUrl: req.body.githubUrl || '',
      liveUrl: req.body.liveUrl || '',
      featured: req.body.featured === 'true',
      category: req.body.category || 'web',
      image: req.file ? req.file.buffer : null // stored in memory
    };

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('❌ Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
});
