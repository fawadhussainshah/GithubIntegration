require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');

const githubRoutes = require('./routes/github');
require('./config/passport');

const app = express();
const PORT = 3000;

// app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
// const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
  
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', githubRoutes);
app.use('/api/github', githubRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
