// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const File = require('../models/file'); 
const path = require('path');
require('dotenv').config(); // Load .env file

// Create an Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Initialize multer with storage settings and file size limit
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true); // Accept the file
    } else {
      cb(new Error('Error: File type not supported!')); // Reject the file
    }
  }
});

// MongoDB connection string
const mongoURI = "mongodb+srv://moorthyanant:yqfKdHwtdpNXP3Fo@cluster0.ywlzo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 

// Connect to MongoDB 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Define a Mongoose model for File
const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

// Upload files
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  const newFile = new File({
    filename: req.file.originalname,
    path: req.file.path 
  });

  try {
    await newFile.save(); // Save file information to the database
    res.status(201).json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Get All Files
app.get('/files', async (req, res) => {
  try {
    const files = await File.find(); // Fetch all files from database
    res.status(200).json(files); // Send the files as a JSON response
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Get a Single File
app.get('/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');
    res.send(file);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update a File (Re-upload)
app.put('/files/:id', upload.single('file'), async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');

    // Delete the existing file
    const fs = require('fs');
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    // Update file information
    file.filename = req.file.originalname;
    file.path = req.file.path;
    await file.save();

    res.send(file);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a File
app.delete('/files/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const deletedFile = await File.findByIdAndDelete(fileId);

    if (!deletedFile) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file from the filesystem
    const fs = require('fs');
    const filePath = path.join(__dirname, 'uploads', deletedFile.filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file from filesystem:', err);
      }
    });
    
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});