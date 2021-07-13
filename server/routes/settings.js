const express = require('express');

const { User } = require('../schema');
const { verifyAccessToken } = require('../utils');


const router = express.Router();
router.use(verifyAccessToken);

router.post('/set-configuration', async (req, res) => {
    const { checkbox, date, interval, invalid, toggle } = req.body

    if (!checkbox || !date || !interval || !invalid) return res.json({ ok: false, message: 'Incomplete' });

    try {
        await User.updateOne({ _id: req.id }, {
            checkbox,
            date,
            interval,
            invalid,
            recurIntegration: toggle
        });
    } catch {
        return res.json({ ok: false, message: 'Something went wrong!' });
    }

    return res.json({ ok: true, message: 'Successfully saved!' });
});

router.get('/dashboard-info', async (req, res) => {
    try {
        const { checkbox, date, interval, invalid, workspaceName, workspaceIcon, recurIntegration } = await User.findById(req.id).exec();
        return res.json({ ok: true, checkbox, date, interval, invalid, workspaceName, workspaceIcon, recurIntegration });
    } catch {
        return res.json({ ok: false, message: 'Something went wrong!' });
    }
});

module.exports = router;
