const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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
    calendarKeys: [{ notion: String, google: String }]
});

userSchema.methods.generateTokens = function () {
    if (this.validEmail) {
        const accessToken = jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
        const refreshToken = jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET + this.password, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    } else {
        throw new Error('unvalidated email');
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;