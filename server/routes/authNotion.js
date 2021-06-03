const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../schema');


const router = express.Router();

const verifyAccessToken = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];

    try {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        return next();
    } catch {
        return res.json({ ok: false });
    }
}


router.use(verifyAccessToken);

router.get('/auth', (req, res) => {
    const link = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.ADDRESS}${process.env.REDIRECT_URI}&response_type=code`;
    res.json({ ok: true, link });
});

router.get(process.env.REDIRECT_URI, async (req, res) => {
    if (!req.query.error) {
        const payload = {
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: `${process.env.ADDRESS}${process.env.REDIRECT_URI}`
        }

        const token = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'utf8').toString('base64');
        const headers = {
            'Authorization': `Basic ${token}`,
            'Content-Type': 'application/json'
        }

        try {
            const { data } = await axios.post('https://api.notion.com/v1/oauth/token', payload, { headers });

            const { id } = req.tokens;

            await User.updateOne({ _id: id }, {
                accessToken: data.access_token,
                workspaceName: data.workspace_name,
                workspaceIcon: data.workspace_icon,
            });

            res.json({ ok: true, ...req.tokens });
        } catch (err) {
            res.json({ ok: false, message: err.message, ...req.tokens });
        }
    } else {
        res.json({ ok: false, message: 'access denied', ...req.tokens });
    }
});

module.exports = router;