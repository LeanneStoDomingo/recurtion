const express = require('express');
const axios = require('axios');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const app = express();

app.get('/', (req, res) => {
    res.send('Recurtion');
});

app.get('/auth', (req, res) => {
    res.redirect(`https://api.notion.com/v1/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code`);
});

app.get('/integrations', (req, res) => {
    res.send('Integrations');

    const token = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'utf8').toString('base64')

    if (!req.query.error) {
        axios.post('https://api.notion.com/v1/oauth/token', {
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: process.env.REDIRECT_URI
        }, {
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(response => console.log('response', response.data)).catch(err => console.error(err));
    } else {
        console.log('access denied')
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
