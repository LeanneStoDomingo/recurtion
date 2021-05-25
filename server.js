const express = require('express');
const axios = require('axios');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();


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
        const count = await User.countDocuments({ email });
        if (count > 0) return res.status(400).send('User already exists');

        const hashedPassword = await bcrypt.hash(password1, 12);
        const user = new User({ email, password: hashedPassword });
        await user.save();

        res.status(201).send('Successfully created an account');
    } catch (err) {
        return res.status(500).send('Something went wrong on the server');
    }

    // send validation email

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    const emailToken = jwt.sign({ email }, process.env.EMAIL_TOKEN_SECRET, { expiresIn: '1d' });
    const link = `${process.env.ADDRESS}/confirmation/${emailToken}`;

    var mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Recurtion - Verify Your Email Address',
        html: `
        <h1>Hello from Recurtion!</h1>
        <p>Click on this <a target="_blank" href="${link}">link</a> to verify your email address.
        <br/><br/>
        Raw url:<br/>
        <a target="_blank" href="${link}">${link}</a>
        </p>
        `
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});

app.get('/confirmation/:token', async (req, res) => {
    const { token } = req.params;

    // verify token

    let data;
    try {
        data = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
    } catch {
        return res.status(400).send('Invalid token');
    }

    try {
        await User.updateOne({ email: data.email }, { validEmail: true });
        res.status(200).send('Your email has been confirmed!');
    } catch {
        return res.status(500).send('Something went wrong on the server');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            if (user.validEmail) {
                res.status(200).send(`User ${user} found`);
            } else {
                return res.status(400).send('Email has not been validated');
            }
        } else {
            return res.status(400).send('Incorrect username/password');
        }
    } catch {
        return res.status(500).send('Something went wrong on the server');
    }
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
