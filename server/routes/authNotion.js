const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../schema');


const router = express.Router();

const verifyAccessToken = async (req, res, next) => {
    const accessToken = req.query.token;

    try {
        const { id } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.id = id;
        return next();
    } catch {
        return res.json({ ok: false, message: 'Invalid token' });
    }
}

router.get('/notion-oauth', verifyAccessToken, async (req, res) => {
    const link = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&state=${req.id}`;
    return res.redirect(link);
});

router.get('/notion-oauth-redirect', async (req, res) => {
    if (req.query.error) return res.json({ ok: false, message: req.query.error });

    const payload = {
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: process.env.REDIRECT_URI
    }

    const token = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'utf8').toString('base64');
    const headers = {
        'Authorization': `Basic ${token}`,
        'Content-Type': 'application/json'
    }

    try {
        const { data } = await axios.post('https://api.notion.com/v1/oauth/token', payload, { headers });

        console.log(`data`, data)

        await User.updateOne({ _id: req.query.state }, {
            accessToken: data.access_token,
            workspaceName: data.workspace_name,
            workspaceIcon: data.workspace_icon,
            botID: data.bot_id
        });

        return res.json({ ok: true, message: 'Successfully authorized Notion' });
    } catch (err) {
        return res.json({ ok: false, message: err.message });
    }
});

module.exports = router;