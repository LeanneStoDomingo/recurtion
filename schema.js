const mongoose = require('mongoose');
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

const User = mongoose.model('User', userSchema);

module.exports = User;