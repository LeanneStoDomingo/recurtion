const express = require('express');
const axios = require('axios');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../schema');
const { verifyAccessToken } = require('../utils');


const router = express.Router();

router.get('/notion-oauth', verifyAccessToken, async (req, res) => {
    const link = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&state=${req.id}`;
    return res.cookie('x-a-token', req.accessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    }).redirect(link);
});

router.get('/notion-oauth-redirect', async (req, res) => {
    if (req.query.error) return res.redirect(`http://localhost:3000/dashboard?ok=false&error=${req.query.error}`);

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

        await User.updateOne({ _id: req.query.state }, {
            accessToken: data.access_token,
            workspaceName: data.workspace_name,
            workspaceIcon: data.workspace_icon,
            botID: data.bot_id
        });

        return res.redirect('http://localhost:3000/dashboard?ok=true');
    } catch (err) {
        return res.redirect(`http://localhost:3000/dashboard?ok=false&error=${err.message}`);
    }
});

router.get('/revoke-notion', verifyAccessToken, async (req, res) => {
    try {
        await User.updateOne({ _id: req.id }, {
            accessToken: undefined,
            workspaceName: undefined,
            workspaceIcon: undefined,
            botID: undefined
        });
    } catch {
        return res.json({ ok: false, message: 'Something went wrong!' });
    }
    return res.json({ ok: true, message: 'Notion authorization revoked' });
});

router.post('/set-configuration', verifyAccessToken, async (req, res) => {
    const { checkbox, date, interval, invalid } = req.body

    if (!checkbox || !date || !interval || !invalid) return res.json({ ok: false, message: 'Incomplete' });

    try {
        await User.updateOne({ _id: req.id }, {
            checkbox,
            date,
            interval,
            invalid
        });
    } catch {
        return res.json({ ok: false, message: 'Something went wrong!' });
    }

    return res.json({ ok: true, message: 'Successfully saved!' });
});

module.exports = router;