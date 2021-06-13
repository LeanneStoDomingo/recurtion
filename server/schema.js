const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('db connection is open'));

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    validEmail: { type: Boolean, default: false },
    accessToken: String,
    workspaceName: String,
    workspaceIcon: String,
    botID: String,
    checkbox: { type: String, default: 'Done' },
    date: { type: String, default: 'Due Date' },
    interval: { type: String, default: 'Recur Interval (text)' },
    invalid: { type: String, default: 'Invalid format' },
    calendarKeys: [{ notion: String, google: String }]
});

userSchema.methods.generateTokens = function () {
    if (!this.validEmail) {
        return { ok: false, tokens: null };
    }

    const accessToken = jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
    const refreshToken = jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET + this.password, { expiresIn: '7d' });
    return { ok: true, tokens: { accessToken, refreshToken } };
}

userSchema.methods.verifyRefreshToken = function (token) {
    try {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET + this.password);
        return true;
    } catch {
        return false;
    }
}

userSchema.methods.sendEmail = function (expiresIn, path, subject, action) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    const emailToken = jwt.sign({ email: this.email }, process.env.EMAIL_TOKEN_SECRET, { expiresIn });
    const link = `${process.env.ADDRESS}${path}/${emailToken}`;

    var mailOptions = {
        from: process.env.GMAIL_USER,
        to: this.email,
        subject,
        html: `
            <h1>Hello from Recurtion!</h1>
            <p>Click on this <a target="_blank" href="${link}">link</a> to ${action}.
            <br/><br/>
            Raw url:<br/>
            <a target="_blank" href="${link}">${link}</a>
            </p>
        `
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            throw new Error();
        }
    });
}

const User = mongoose.model('User', userSchema);

module.exports = User;