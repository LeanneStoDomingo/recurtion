const express = require('express');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const auth = require('./routes/auth');
const authNotion = require('./routes/authNotion');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Recurtion');
});

app.use('/', auth);
app.use('/', authNotion);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
