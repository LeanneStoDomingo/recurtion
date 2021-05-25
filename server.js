const express = require('express');
const axios = require('axios');
const bcrypt = require('bcrypt');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const User = require('./schema');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Recurtion');
});

app.post('/signup', async (req, res) => {
    const { email, password1, password2 } = req.body;

    if (password1 !== password2) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        const hashedPassword = await bcrypt.hash(password1, 12);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).send('Successfully created an account');
    } catch (err) {
        res.status(500).send('Something went wrong on the server');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    await User.findOne({ email }, async (err, user) => {
        try {
            if (user && await bcrypt.compare(password, user.password)) {
                if (user.validEmail) {
                    res.status(200).send(`User ${user} found`);
                } else {
                    res.status(400).send('Email has not been validated');
                }
            } else {
                res.status(400).send('Incorrect username/password');
            }
        } catch {
            res.status(500).send('Something went wrong on the server');
        }
    });
});

app.get('/auth', (req, res) => {
    res.redirect(`https://api.notion.com/v1/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.ADDRESS}${process.env.REDIRECT_URI}&response_type=code`);
});

app.get(process.env.REDIRECT_URI, async (req, res) => {
    res.send('Integrations');

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
            const response = await axios.post('https://api.notion.com/v1/oauth/token', payload, { headers });
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    } else {
        console.log('access denied')
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
