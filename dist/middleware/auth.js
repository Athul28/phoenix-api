"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || 'secretkey';
const authenticateToken = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.status(403).send('Access denied');
    jsonwebtoken_1.default.verify(token, secret, (err, user) => {
        if (err)
            return res.status(403).send('Invalid token');
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
