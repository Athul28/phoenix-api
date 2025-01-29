"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gadgetRouter = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const unique_names_generator_1 = require("unique-names-generator");
const unique_names_generator_2 = require("unique-names-generator");
const router = express_1.default.Router();
exports.gadgetRouter = router;
// GET /gadgets
router.get("/", async (req, res) => {
    try {
        const gadgets = await prisma.gadget.findMany();
        const gadgetsWithProbability = gadgets.map((gadget) => ({
            ...gadget,
            missionSuccessProbability: `${(0, unique_names_generator_1.uniqueNamesGenerator)({
                dictionaries: [unique_names_generator_2.adjectives, unique_names_generator_2.animals], // You can replace with custom word lists
                separator: " ",
                style: "capital"
            })} - ${Math.floor(Math.random() * 101)}% success probability`,
        }));
        res.json(gadgetsWithProbability);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch gadgets" });
    }
});
// POST /gadgets
router.post("/", async (req, res) => {
    const { name } = req.body;
    const codename = (0, unique_names_generator_1.uniqueNamesGenerator)({
        dictionaries: [unique_names_generator_2.adjectives, unique_names_generator_2.animals], // You can replace with custom word lists
        separator: " ",
        style: "capital"
    }); // Random codename generation
    const gadget = await prisma.gadget.create({
        data: { name: codename, status: "Available" },
    });
    res.status(201).json(gadget);
});
// PATCH /gadgets/:id
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;
    try {
        const gadget = await prisma.gadget.update({
            where: { id },
            data: { name, status },
        });
        res.json(gadget);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update gadget" });
    }
});
// DELETE /gadgets/:id
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const gadget = await prisma.gadget.update({
            where: { id },
            data: { status: "Decommissioned", decommissionedAt: new Date() },
        });
        res.json(gadget);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to decommission gadget" });
    }
});
// POST /gadgets/:id/self-destruct
router.post("/:id/self-destruct", async (req, res) => {
    const { id } = req.params;
    const confirmationCode = generateConfirmationCode(); // Random code generation
    // Confirm code (skipping actual validation for this example)
    res.json({
        message: "Self-destruct sequence triggered",
        code: confirmationCode,
    });
});
function generateCodename() {
    const codenames = ["The Nightingale", "The Kraken", "The Phoenix"];
    return codenames[Math.floor(Math.random() * codenames.length)];
}
function generateConfirmationCode() {
    return Math.floor(100000 + Math.random() * 900000); // Random 6-digit code
}
