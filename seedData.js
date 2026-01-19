const mongoose = require('mongoose');
require('dotenv').config();

// Models
const Project = require('./models/project');
const Skill = require('./models/Skill');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

const sampleProjects = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce application with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment integration.",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe API"],
    githubUrl: "https://github.com/yourusername/ecommerce-platform",
    liveUrl: "https://your-ecommerce-demo.vercel.app",
    featured: true,
    category: "fullstack"
  },
  {
    title: "Task Management App",
    description: "A collaborative task management tool with real-time updates, drag-and-drop functionality, and team collaboration features.",
    technologies: ["React", "Socket.io", "MongoDB", "Node.js"],
    githubUrl: "https://github.com/yourusername/task-manager",
    liveUrl: "https://your-taskapp.netlify.app",
    featured: true,
    category: "web"
  },
  {
    title: "Weather Dashboard",
    description: "A responsive weather application that displays current weather and forecasts using a third-party weather API.",
    technologies: ["JavaScript", "CSS3", "REST API", "Chart.js"],
    githubUrl: "https://github.com/yourusername/weather-dashboard",
    liveUrl: "https://your-weather-app.github.io",
    featured: false,
    category: "web"
  },
  {
    title: "Portfolio Website",
    description: "A responsive portfolio website showcasing projects and skills with modern UI/UX design principles.",
    technologies: ["HTML5", "CSS3", "JavaScript", "GSAP"],
    githubUrl: "https://github.com/yourusername/portfolio",
    liveUrl: "https://yourportfolio.com",
    featured: true,
    category: "web"
  }
];

const sampleSkills = [
  // Frontend
  { name: "React", category: "frontend", proficiency: 85, order: 1 },
  { name: "JavaScript", category: "frontend", proficiency: 90, order: 2 },
  { name: "HTML5", category: "frontend", proficiency: 95, order: 3 },
  { name: "CSS3", category: "frontend", proficiency: 88, order: 4 },
  { name: "Bootstrap", category: "frontend", proficiency: 80, order: 5 },
  
  // Backend
  { name: "Node.js", category: "backend", proficiency: 82, order: 1 },
  { name: "Express.js", category: "backend", proficiency: 85, order: 2 },
  { name: "Python", category: "backend", proficiency: 75, order: 3 },
  
  // Database
  { name: "MongoDB", category: "database", proficiency: 80, order: 1 },
  { name: "MySQL", category: "database", proficiency: 70, order: 2 },
  
  // Tools
  { name: "Git", category: "tools", proficiency: 85, order: 1 },
  { name: "VS Code", category: "tools", proficiency: 90, order: 2 },
  { name: "Postman", category: "tools", proficiency: 80, order: 3 },
  
  // Soft Skills
  { name: "Problem Solving", category: "soft", proficiency: 90, order: 1 },
  { name: "Team Collaboration", category: "soft", proficiency: 85, order: 2 },
  { name: "Communication", category: "soft", proficiency: 88, order: 3 }
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log(' Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany({});
    await Skill.deleteMany({});
    console.log(' Cleared existing data');

    // Insert sample projects
    const projects = await Project.insertMany(sampleProjects);
    console.log(` Added ${projects.length} projects`);

    // Insert sample skills
    const skills = await Skill.insertMany(sampleSkills);
    console.log(` Added ${skills.length} skills`);

    console.log('\n Sample data seeded successfully!');
    console.log('\n You can now test these endpoints:');
    console.log('   GET http://localhost:5000/api/projects');
    console.log('   GET http://localhost:5000/api/skills');
    console.log('   GET http://localhost:5000/api/projects/featured');
    
  } catch (error) {
    console.error(' Error seeding data:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n📝 Database connection closed');
  }
};

seedData();