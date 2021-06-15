const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { User } = require('../schema');

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!email || !user) return res.json({ ok: false, message: 'Invalid email' });

    try {
        await user.sendEmail('1h', '/reset-password', 'Recurtion - Reset Your Password', 'reset your password');
    } catch {
        return res.json({ ok: false, message: 'Something went wrong!' });
    }

    return res.json({ ok: true, message: 'Email sent!' });
});

router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    const { email } = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);

    if (!email) return res.redirect('http://localhost:3000/login?ok=false');

    return res.redirect(`http://localhost:3000/reset-password/${token}`);
});

router.post('/password-confirmation', async (req, res) => {
    const { token, password1, password2 } = req.body;

    if (password1 !== password2) return res.json({ ok: false, message: 'Passwords do not match' });

    const { email } = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);

    if (!email) return res.json({ ok: false, message: 'Something went wrong!' });

    const hashedPassword = await bcrypt.hash(password1, 12);

    try {
        await User.updateOne({ email }, { password: hashedPassword });
    } catch {
        return res.json({ ok: false, message: 'Something went wrong!' });
    }

    return res.json({ ok: true, message: 'Password successfully changed!' });
});

module.exports = router;
