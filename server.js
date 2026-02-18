const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
// Replace with your actual MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/edhills'; 

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// User Model
const User = require('./models/User');

// Routes
// Register Route (for testing purposes)
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password (in a real app, use bcrypt)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: { email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
