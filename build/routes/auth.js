"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => {
    const { userId } = req.body; // Normally, you'd verify credentials from DB
    if (!userId)
        return res.status(400).json({ message: 'User ID is required' });
    const token = (0, jwt_1.generateToken)(userId);
    res.json({ token });
});
exports.default = router;
