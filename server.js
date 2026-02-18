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

// Models
const User = require('./models/User');
const Student = require('./models/Student');

// Routes
// Bulk Import Students (Excel Data)
app.post('/api/students/import', async (req, res) => {
  const studentsData = req.body; // Expecting an array of student objects

  if (!Array.isArray(studentsData)) {
    return res.status(400).json({ error: 'Data must be an array' });
  }

  try {
    const students = await Student.insertMany(studentsData);
    res.status(201).json({ message: 'Students imported successfully', count: students.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to import students. Check for duplicate roll numbers.' });
  }
});

// Get All Students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ dateAdded: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
// Register Route (User + Student Details)
app.post('/api/register', async (req, res) => {
  const { name, email, password, rollNumber, class: studentClass, phone } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // 2. Check if Roll Number is unique
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({ error: 'Roll Number already exists' });
    }

    // 3. Create User Account
    const newUser = new User({ email, password });
    await newUser.save();

    // 4. Create Student Details Profile
    const newStudent = new Student({
      name,
      email,
      rollNumber,
      class: studentClass,
      phone
    });
    await newStudent.save();

    res.status(201).json({ message: 'Account and Student Profile created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration' });
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

    // Fetch Student Details
    const student = await Student.findOne({ email });

    res.json({ 
      message: 'Login successful', 
      user: { 
        email: user.email,
        name: student ? student.name : 'Student',
        rollNumber: student ? student.rollNumber : 'N/A',
        class: student ? student.class : 'N/A',
        phone: student ? student.phone : 'N/A'
      } 
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Login Route
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Authorization Failed' });
    }

    // Check Password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    // Check Role
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Not an Admin' });
    }

    res.json({ message: 'Admin Welcome', token: 'mock-admin-token-123' });
  } catch (err) {
    res.status(500).json({ error: 'Security Server Error' });
  }
});

// Forgot Password Route
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    // In a real app, you would generate a token and send an actual email here.
    // For this demo, we simulate success.
    res.json({ message: 'Reset link sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Temporary storage for OTPs (In-memory for demo)
const otpStore = new Map();

// Send OTP Route
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    // In a real app, send this via email API (Nodemailer/SendGrid)
    console.log(`[OTP DEBUG] OTP for ${email}: ${otp}`);
    
    res.json({ message: 'OTP sent successfully to your registered email' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify OTP Login Route
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  
  try {
    const storedOtp = otpStore.get(email);
    
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP after successful use
    otpStore.delete(email);

    // Fetch User & Student Details
    const user = await User.findOne({ email });
    const student = await Student.findOne({ email });

    res.json({ 
      message: 'Login successful via OTP', 
      user: { 
        email: user.email,
        name: student ? student.name : 'Student',
        rollNumber: student ? student.rollNumber : 'N/A',
        class: student ? student.class : 'N/A',
        phone: student ? student.phone : 'N/A'
      } 
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Final Password Reset Route
app.post('/api/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  try {
    const storedOtp = otpStore.get(email);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update password (use bcrypt in production)
    user.password = newPassword;
    await user.save();

    otpStore.delete(email);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
