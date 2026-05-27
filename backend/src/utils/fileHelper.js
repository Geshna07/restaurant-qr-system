// This file helps us read and write JSON files easily
// Think of it as our simple database helper

const fs = require('fs');
const path = require('path');

// Read data from a JSON file
const readData = (filename) => {
  try {
    // Build the full path to the file
    const filePath = path.join(__dirname, '../data', filename);
    // Read the file contents
    const rawData = fs.readFileSync(filePath, 'utf8');
    // Convert JSON string to JavaScript object
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
};

// Write data to a JSON file
const writeData = (filename, data) => {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    // Convert JavaScript object to formatted JSON string
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

module.exports = { readData, writeData };