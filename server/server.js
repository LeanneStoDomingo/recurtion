const express = require('express');
const axios = require('axios');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });



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
            // create access and refresh tokens
            const tokens = user.generateTokens();
            res.status(200).json(tokens);
        } else {
            return res.status(400).send('Incorrect email/password');
        }
    } catch (err) {
        if (err.message === 'unvalidated email') {
            return res.status(400).send('Email has not been validated');
        } else {
            return res.status(500).send('Something went wrong on the server');
        }
    }
});

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

app.get('/auth', verifyTokens, (req, res) => {
    const link = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.ADDRESS}${process.env.REDIRECT_URI}&response_type=code`;
    res.json({ link, ...req.tokens });
});

app.get(process.env.REDIRECT_URI, verifyTokens, async (req, res) => {
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
