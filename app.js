const mongoose = require('mongoose');
const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const authRouter = require('./Routers/authRouter')
const postRouter = require('./Routers/postRouter')

const PORT = process.env.PORT || 3000;
const DATABASE = process.env.DATABASE;

mongoose.connect(DATABASE)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Server is running');
});
app.use('/api/user', authRouter);
app.use('/api/post', postRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
