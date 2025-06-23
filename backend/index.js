const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '12345', 
  database: 'myapp' 
});
db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'salimfekih35@gmail.com', 
    pass: 'pkqs zwrc vhfh vvzi ' 
  }
});


const users = [
  { username: 'admin', password: 'admin', role: 'admin' },
  { username: 'user', password: 'user', role: 'user' }
];

const resetCodes = {};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query(
    'SELECT role FROM users WHERE (username = ? OR email = ?) AND password = ?',
    [username, username, password],
    (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      if (results.length > 0) {
        res.json({ success: true, role: results[0].role });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }
  );
});

app.post('/api/createAccount', (req, res) => {
  const { username, password, nom, prenom, email, telephone, pays } = req.body;
  console.log('Received createAccount:', req.body); 
  db.query(
    'SELECT id FROM users WHERE username = ? OR email = ?',
    [username, email],
    (err, results) => {
      if (err) {
        console.error('Error on SELECT:', err); 
        return res.status(500).json({ success: false, message: 'Database error', error: err.message });
      }
      if (results.length > 0) {
        return res.status(409).json({ success: false, message: 'User already exists' });
      }
      db.query(
        'INSERT INTO users (username, password, nom, prenom, email, telephone, pays, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',        [username, password, nom, prenom, email, telephone, pays, 'user'],
        (err2) => {
          if (err2) {
            console.error('Error on INSERT:', err2); 
            return res.status(500).json({ success: false, message: 'Database error', error: err2.message });
          }
          res.json({ success: true });
        }
      );
    }
  );
});

app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    db.query('UPDATE users SET reset_code = ? WHERE email = ?', [code, email], (err2) => {
      if (err2) return res.status(500).json({ success: false, message: 'Database error' });
      
      const mailOptions = {
        from: 'salimfekih35@gmail.com',
        to: email,
        subject: 'Reset Password', 
        text: `Your password reset code is: ${code}`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
        }
        console.log(`Reset code for ${email}: ${code}`);
        res.json({ success: true });
      });
    });
  });
});

app.post('/api/reset-password', (req, res) => {
  const { email, code, newPassword } = req.body;
  db.query('SELECT id FROM users WHERE email = ? AND reset_code = ?', [email, code], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid code' });
    }
    db.query('UPDATE users SET password = ?, reset_code = NULL WHERE email = ?', [newPassword, email], (err2) => {
      if (err2) return res.status(500).json({ success: false, message: 'Database error' });
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
