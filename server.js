// ============================================================
//  edHills Backend - server.js
//  Self-contained: uses JSON file as database (no MongoDB needed)
//  Dependencies: express, cors, bcryptjs, jsonwebtoken
// ============================================================

const express    = require('express');
const cors       = require('cors');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const fs         = require('fs');
const path       = require('path');

const app  = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'edhills_super_secret_2026';

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve static HTML files from the same directory
app.use(express.static(path.join(__dirname)));

// ── JSON File Database helpers ──────────────────────────────
const DB_FILE = path.join(__dirname, 'db.json');

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = { users: [], students: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ── Seed: default admin account (only once) ─────────────────
(async () => {
  const db = readDB();
  const adminExists = db.users.find(u => u.email === 'admin@edhills.com');
  if (!adminExists) {
    const hashed = await bcrypt.hash('Admin@2026', 10);
    db.users.push({
      id: 'admin-001',
      email: 'admin@edhills.com',
      password: hashed,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    writeDB(db);
    console.log('✅ Default admin created → admin@edhills.com / Admin@2026');
  }
})();

// ══════════════════════════════════════════════════════════════
//  STUDENT REGISTER
//  POST /api/register
//  Body: { name, email, password, phone, class, rollNumber }
// ══════════════════════════════════════════════════════════════
app.post('/api/register', async (req, res) => {
  const { name, email, password, phone, class: studentClass, rollNumber } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const db = readDB();

  // Check duplicate email
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email is already registered. Please login.' });
  }

  // Check duplicate roll number (optional field)
  if (rollNumber && db.students.find(s => s.rollNumber === rollNumber)) {
    return res.status(400).json({ error: 'Roll Number already exists. Use a different one.' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const userId = 'USR-' + Date.now();

    // Save user credentials
    db.users.push({
      id: userId,
      email,
      password: hashed,
      role: 'student',
      createdAt: new Date().toISOString()
    });

    // Save student profile
    db.students.push({
      userId,
      name,
      email,
      phone: phone || '',
      class: studentClass || 'Class 12',
      rollNumber: rollNumber || ('EDH-' + Date.now()),
      enrolledCourses: [],
      createdAt: new Date().toISOString()
    });

    writeDB(db);

    const token = jwt.sign({ userId, email, role: 'student' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully! Welcome to edHills.',
      token,
      user: {
        name,
        email,
        phone: phone || '',
        class: studentClass || 'Class 12',
        rollNumber: rollNumber || '',
        enrolledCourses: []
      }
    });
  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// ══════════════════════════════════════════════════════════════
//  STUDENT / USER LOGIN
//  POST /api/login
//  Body: { identifier (email or phone), password }
// ══════════════════════════════════════════════════════════════
app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email/Phone and password are required.' });
  }

  const db = readDB();
  let user = null;
  let student = null;

  // Find by email
  if (identifier.includes('@')) {
    user = db.users.find(u => u.email === identifier);
    student = db.students.find(s => s.email === identifier);
  } else {
    // Find by phone
    student = db.students.find(s => s.phone === identifier);
    if (student) {
      user = db.users.find(u => u.email === student.email);
    }
  }

  if (!user) {
    return res.status(400).json({ message: 'Account not found. Please register first.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: 'Incorrect password. Please try again.' });
  }

  const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Login successful! Welcome back.',
    token,
    user: {
      name:            student ? student.name            : 'Student',
      email:           user.email,
      phone:           student ? student.phone           : '',
      class:           student ? student.class           : 'N/A',
      rollNumber:      student ? student.rollNumber      : 'N/A',
      enrolledCourses: student ? student.enrolledCourses : [],
      role:            user.role
    }
  });
});

// ══════════════════════════════════════════════════════════════
//  GET STUDENT PROFILE
//  GET /api/student/profile/:email
// ══════════════════════════════════════════════════════════════
app.get('/api/student/profile/:email', (req, res) => {
  const db = readDB();
  const student = db.students.find(s => s.email === req.params.email);
  if (!student) return res.status(404).json({ message: 'Profile not found.' });
  res.json(student);
});

// ══════════════════════════════════════════════════════════════
//  ADMIN LOGIN
//  POST /api/admin/login
//  Body: { email, password }
// ══════════════════════════════════════════════════════════════
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email);

  if (!user) return res.status(401).json({ message: 'Admin account not found.' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials.' });

  if (user.role !== 'admin') return res.status(403).json({ message: 'Access Denied: Not an Admin.' });

  const token = jwt.sign({ userId: user.id, email, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ message: 'Admin authenticated successfully.', token });
});

// ══════════════════════════════════════════════════════════════
//  FORGOT PASSWORD (send reset link simulation)
//  POST /api/forgot-password
// ══════════════════════════════════════════════════════════════
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: 'No account found with that email.' });
  // In production, send email. For now, simulate success.
  res.json({ message: 'Password reset link sent! Check your email.' });
});

// ══════════════════════════════════════════════════════════════
//  LIST ALL STUDENTS (Admin only)
//  GET /api/admin/students
// ══════════════════════════════════════════════════════════════
app.get('/api/admin/students', (req, res) => {
  const db = readDB();
  res.json(db.students);
});

// ══════════════════════════════════════════════════════════════
//  OTP store (in-memory, for demo)
// ══════════════════════════════════════════════════════════════
const otpStore = new Map();

app.post('/api/send-otp', (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ message: 'Identifier required.' });

  const db = readDB();
  let email = identifier;
  if (!identifier.includes('@')) {
    const s = db.students.find(s => s.phone === identifier);
    if (!s) return res.status(404).json({ message: 'Mobile number not registered.' });
    email = s.email;
  }

  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
  console.log(`[OTP] ${email} → ${otp}`);
  res.json({ message: `OTP sent to ${identifier}. (Check server console for demo OTP)` });
});

app.post('/api/verify-otp', async (req, res) => {
  const { identifier, otp } = req.body;
  const db = readDB();
  let email = identifier;
  if (!identifier.includes('@')) {
    const s = db.students.find(s => s.phone === identifier);
    if (!s) return res.status(404).json({ message: 'Mobile number not registered.' });
    email = s.email;
  }

  const stored = otpStore.get(email);
  if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }
  otpStore.delete(email);

  const user = db.users.find(u => u.email === email);
  const student = db.students.find(s => s.email === email);
  const token = jwt.sign({ userId: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'OTP verified. Login successful!',
    token,
    user: {
      name:            student ? student.name            : 'Student',
      email,
      phone:           student ? student.phone           : '',
      class:           student ? student.class           : 'N/A',
      rollNumber:      student ? student.rollNumber      : 'N/A',
      enrolledCourses: student ? student.enrolledCourses : []
    }
  });
});

// ── Start server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 edHills Server running at http://localhost:${PORT}`);
  console.log(`📁 Database file: db.json (auto-created)`);
  console.log(`👤 Admin login  : admin@edhills.com / Admin@2026\n`);
});
