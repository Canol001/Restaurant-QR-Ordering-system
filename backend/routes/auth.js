const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Dummy admin credentials — replace with DB lookup later!
const adminUser = {
  email: 'admin@restaurant.com',
  password: '$2b$10$/cJuRqFAUTV1mKHu6FPft.mUZv87pCYR8i/hjYRUCsMXM38A7Pdbi', // 'admin123' hashed
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Incoming login:', { email, password });
console.log('Expected:', adminUser.email);

  if (email !== adminUser.email) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, adminUser.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

module.exports = router;
