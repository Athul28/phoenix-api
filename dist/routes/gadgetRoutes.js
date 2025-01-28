"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gadgetRouter = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
exports.gadgetRouter = router;
// GET /gadgets
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gadgets = yield prisma.gadget.findMany();
        res.json(gadgets);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch gadgets' });
    }
}));
// POST /gadgets
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const codename = generateCodename(); // Random codename generation
    const gadget = yield prisma.gadget.create({
        data: { name, status: 'Available' },
    });
    res.status(201).json(gadget);
}));
// PATCH /gadgets/:id
router.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, status } = req.body;
    try {
        const gadget = yield prisma.gadget.update({
            where: { id },
            data: { name, status },
        });
        res.json(gadget);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update gadget' });
    }
}));
// DELETE /gadgets/:id
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const gadget = yield prisma.gadget.update({
            where: { id },
            data: { status: 'Decommissioned', decommissionedAt: new Date() },
        });
        res.json(gadget);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to decommission gadget' });
    }
}));
// POST /gadgets/:id/self-destruct
router.post('/:id/self-destruct', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const confirmationCode = generateConfirmationCode(); // Random code generation
    // Confirm code (skipping actual validation for this example)
    res.json({ message: 'Self-destruct sequence triggered', code: confirmationCode });
}));
function generateCodename() {
    const codenames = ['The Nightingale', 'The Kraken', 'The Phoenix'];
    return codenames[Math.floor(Math.random() * codenames.length)];
}
function generateConfirmationCode() {
    return Math.floor(100000 + Math.random() * 900000); // Random 6-digit code
}
