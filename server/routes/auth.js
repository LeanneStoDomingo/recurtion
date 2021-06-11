const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../schema');
const { verifyAccessToken } = require('../utils');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password1, password2 } = req.body;

    if (password1 !== password2) return res.json({ ok: false, message: 'Passwords do not match' });

    const count = await User.countDocuments({ email });
    if (count > 0) return res.send({ ok: false, message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password1, 12);
    const user = new User({ email, password: hashedPassword });

    try {
        const savedUser = await user.save();
        await savedUser.sendEmail('1d', '/confirmation', 'Recurtion - Verify Your Email Address', 'verify your email address');
    } catch {
        return res.json({
            ok: false,
            message: 'Something went wrong! Contact support if verification email wasn\'t sent'
        });
    }

    return res.json({ ok: true, message: 'Verification email sent!' });
});

router.get('/confirmation/:token', async (req, res) => {
    const { token } = req.params;

    const { email } = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);

    if (!email) return res.redirect('http://localhost:3000/login?ok=false');

    try {
        await User.updateOne({ email }, { validEmail: true });
    } catch {
        return res.redirect('http://localhost:3000/login?ok=false');
    }

    return res.redirect('http://localhost:3000/login?ok=true');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.json({ ok: false, message: 'Incorrect email/password' });
    }

    const { ok, tokens } = user.generateTokens();

    if (!ok) {
        return res.json({ ok, message: 'Email has not been validated' });
    }

    res.cookie('x-token', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    });

    return res.json({ ok, accessToken: tokens.accessToken });
});

router.post('/logout', verifyAccessToken, (req, res) => {
    return res.clearCookie('x-token').end();
});


module.exports = router;
