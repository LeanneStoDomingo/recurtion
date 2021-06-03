const express = require('express');
const axios = require('axios');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../schema');



const router = express.Router();

const verifyTokens = async (req, res, next) => {
    const headers = req.headers;
    const accessToken = req.tokens?.accessToken || headers.authorization?.split(' ')[1];
    const refreshToken = req.tokens?.refreshToken || headers['refresh-token'];

    let user;
    try {
        const { id } = jwt.decode(accessToken, process.env.ACCESS_TOKEN_SECRET);
        user = await User.findById(id).exec();

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.tokens = { id, accessToken, refreshToken };

        next();
    } catch (err) {
        if (err.message === 'jwt expired') {
            try {
                const { id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET + user.password);

                const tokens = user.generateTokens();
                req.tokens = { id, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
                console.log('refresh');

                next();
            } catch (err) {
                if (err.message === 'jwt expired') {
                    res.status(400).send('Log back in');
                } else {
                    res.status(500).send('Something went wrong on the server');
                }
            }
        } else {
            res.status(500).send('Something went wrong on the server');
        }
    }
}


router.use(verifyTokens);

router.get('/auth', (req, res) => {
    const link = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.ADDRESS}${process.env.REDIRECT_URI}&response_type=code`;
    res.json({ link, ...req.tokens });
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
            console.log(data);

            const { id } = req.tokens;

            await User.updateOne({ id }, {
                accessToken: data.access_token,
                workspaceName: data.workspace_name,
                workspaceIcon: data.workspace_icon,
            });

            res.json(req.tokens);
        } catch (err) {
            console.error(err);
            res.json({ error: err.message, ...req.tokens });
        }
    } else {
        console.log('access denied')
        res.json({ error: 'access denied', ...req.tokens });
    }
});

module.exports = router;