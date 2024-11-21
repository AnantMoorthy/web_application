const mongoose = require('mongoose');

// Define the schema for the file
const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true }, // Original name of the file
  path: { type: String, required: true },     // Path where the file is stored
  uploadedAt: { type: Date, default: Date.now } // Date when the file was uploaded
});

// Create the model from the schema
const File = mongoose.model('File', fileSchema);

// Export the model
module.exports = File;