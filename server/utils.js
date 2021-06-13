const jwt = require("jsonwebtoken");

const verifyAccessToken = async (req, res, next) => {
    const accessToken = req.query.token || req.headers.authorization?.split(' ')[1] || req.cookies['x-a-token'];

    try {
        const { id } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.id = id;
        req.accessToken = accessToken;
        return next();
    } catch {
        return res.json({ ok: false, message: 'Invalid token' });
    }
}

module.exports = { verifyAccessToken };