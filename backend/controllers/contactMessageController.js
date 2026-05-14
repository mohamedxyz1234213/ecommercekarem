const { validationResult } = require('express-validator');
const ContactMessage = require('../models/ContactMessage');
const { sendContactMessageNotification } = require('../utils/email');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const submitContactMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const subject = String(req.body.subject || '').trim();
    const message = String(req.body.message || '').trim();

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    sendContactMessageNotification(contactMessage).catch(() => {});

    return res.status(201).json({
      message: 'Your message has been sent successfully.',
    });
  } catch (error) {
    console.error('submitContactMessage error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getContactMessages = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const isReadFilter = req.query.isRead;
    const search = String(req.query.search || '').trim();

    const filter = {};
    if (isReadFilter === 'true' || isReadFilter === 'false') {
      filter.isRead = isReadFilter === 'true';
    }
    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
        { subject: { $regex: safeSearch, $options: 'i' } },
        { message: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    const total = await ContactMessage.countDocuments(filter);
    const pages = Math.max(Math.ceil(total / limit), 1);

    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      messages,
      page,
      pages,
      total,
    });
  } catch (error) {
    console.error('getContactMessages error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateContactMessageReadStatus = async (req, res) => {
  try {
    if (typeof req.body?.isRead !== 'boolean') {
      return res.status(400).json({ message: 'isRead must be a boolean value' });
    }

    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isRead = req.body.isRead;
    await message.save();

    return res.json({ message: 'Message status updated', contactMessage: message });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Message not found' });
    }
    console.error('updateContactMessageReadStatus error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
  updateContactMessageReadStatus,
};
