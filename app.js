const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DATABASE = process.env.DATABASE;

mongoose.connect(DATABASE)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('aaaaaaa');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
