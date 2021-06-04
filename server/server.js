const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const auth = require('./routes/auth');
const authNotion = require('./routes/authNotion');

const User = require('./schema');


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Recurtion');
});

app.post('/refresh-tokens', async (req, res) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies['x-token'];

    if (!accessToken || !refreshToken) {
        return res.json({ ok: false, message: 'Token(s) not found' });
    }

    const { id } = jwt.decode(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (!id) {
        return res.json({ ok: false, message: 'Invalid token' });
    }

    const user = await User.findById(id).exec();

    const valid = user.verifyRefreshToken(refreshToken);

    if (!valid) {
        return res.json({ ok: false, message: 'Invalid token' });
    }

    const tokens = user.generateTokens();

    res.cookie('x-token', tokens.refreshToken, {
        httpOnly: true
    });

    return res.json({ ok: true, accessToken: tokens.accessToken });
});

app.use('/', auth);
app.use('/', authNotion);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});