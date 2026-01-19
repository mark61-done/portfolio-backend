const express = require('express');
const ContactMessage = require('../models/ContactMessage.js');

module.exports = (io) => {
  const router = express.Router();

  // POST contact form
  router.post('/', async (req, res) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      const newMessage = new ContactMessage({ name, email, message });
      await newMessage.save();

      // Emit the new message to admin clients
      io.emit('newMessage', newMessage);

      res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  });

  return router;
};
