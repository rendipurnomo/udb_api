const express = require('express');
const { SignIn, SignOut } = require('../../middleware/auth.js');

const router = express.Router();

router.post('/signIn', SignIn);
router.post('/signOut', SignOut);

module.exports = router