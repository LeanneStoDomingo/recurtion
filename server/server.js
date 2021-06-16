const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const auth = require('./routes/auth');
const password = require('./routes/password');
const authNotion = require('./routes/authNotion');
const settings = require('./routes/settings');

const { User } = require('./schema');
const { verifyAccessToken } = require('./utils');

const app = express();
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
    exposedHeaders: ["set-cookie"]
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Recurtion');
});

app.get('/refresh-tokens', async (req, res) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies['x-token'];

    if (!accessToken || !refreshToken) {
        return res.json({ ok: false, message: 'Token(s) not found' });
    }

    const { id } = jwt.decode(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (!id) return res.json({ ok: false, message: 'Invalid token' });

    const user = await User.findById(id).exec();

    const valid = user.verifyRefreshToken(refreshToken);

    if (!valid) return res.json({ ok: false, message: 'Invalid token' });

    const { ok, tokens } = user.generateTokens();

    if (!ok) return res.json({ ok: false, message: 'Something went wrong!' });

    return res.cookie('x-token', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    }).json({ ok: true, accessToken: tokens.accessToken });
});

app.get('/delete-account', verifyAccessToken, async (req, res) => {
    const { id } = req;

    if (!id) return res.json({ ok: false, message: 'Something went wrong!' });

    try {
        await User.deleteOne({ _id: id });
    } catch (err) {
        return res.json({ ok: false, message: 'Something went wrong!' });
    }

    return res.clearCookie('x-token').json({ ok: true, message: 'Account deleted' });
});

app.use('/', auth);
app.use('/', password);
app.use('/', authNotion);
app.use('/', settings);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
