const express = require('express');
const multer = require('multer');
const path = require('path');
const { submitComplaint } = require('../controllers/complaint.controller');
const router = express.Router();

// Setup file upload with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Submit complaint route
router.post('/complaint', upload.array('files', 5), submitComplaint);

module.exports = router;
