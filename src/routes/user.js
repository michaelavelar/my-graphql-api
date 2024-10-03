const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.get('/:id', auth, async (req, res) => {
  const user = await User.findUser(parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');
  res.json(user);
});

module.exports = router;
