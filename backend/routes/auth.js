const express = require('express');
const router = express.Router();

let users = [];

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = {
      id: Date.now(),
      username,
      email,
      password // In a real app, this should be hashed
    };

    users.push(user);

    // Don't send password back
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router;