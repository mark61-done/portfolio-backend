const express = require('express');
const router = express.Router();
const ContactMessage = require('../../models/ContactMessage');
const { auth, adminAuth } = require('../../middleware/auth');

// GET all messages (Admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// GET single message
router.get('/:id', auth, adminAuth, async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message)
      return res.status(404).json({ success: false, message: 'Message not found' });

    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// DELETE message
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message)
      return res.status(404).json({ success: false, message: 'Message not found' });

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Deletion failed', error: error.message });
  }
});

router.get('/unread/count', async (req, res) => {
  try {
    const count = await Message.countDocuments({ read: false });
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch unread messages count' });
  }
});


module.exports = router;
