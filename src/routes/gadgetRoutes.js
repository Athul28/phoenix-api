import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
import { uniqueNamesGenerator } from "unique-names-generator";
import { adjectives, animals } from "unique-names-generator";

const router = express.Router();

// Middleware to authenticate JWT token
function authenticateJWT(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user; // Add user info to request
    next();
  });
}

// GET /gadgets
router.get("/", authenticateJWT, async (req, res) => {
  const { status } = req.query;
  try {
    if (status) {
      const gadgets = await prisma.gadget.findMany();
      const filteredGadgets = gadgets.filter(
        (g) => g.status.toLowerCase() === status.toLowerCase()
      );
      res.json(filteredGadgets);
    } else {
      const gadgets = await prisma.gadget.findMany();
      const gadgetsWithProbability = gadgets.map((gadget) => ({
        ...gadget,
        missionSuccessProbability: `${uniqueNamesGenerator({
          dictionaries: [adjectives, animals],
          separator: " ",
          style: "capital",
        })} - ${Math.floor(Math.random() * 101)}% success probability`,
      }));
      res.json(gadgetsWithProbability);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gadgets" });
  }
});

// POST /gadgets
router.post("/", authenticateJWT, async (req, res) => {
  const codename = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: " ",
    style: "capital",
  }); // Random codename generation
  const gadget = await prisma.gadget.create({
    data: { name: codename, status: "Available" },
  });
  res.status(201).json(gadget);
});

// PATCH /gadgets/:id
router.patch("/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  try {
    const gadget = await prisma.gadget.update({
      where: { id: id },
      data: { name, status, updatedAt: new Date() },
    });
    res.json(gadget);
  } catch (error) {
    res.status(500).json({ error: "Failed to update gadget" });
  }
});

// DELETE /gadgets/:id
router.delete("/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const gadget = await prisma.gadget.update({
      where: { id },
      data: { status: "Decommissioned", decommissionedAt: new Date() },
    });
    res.json(gadget);
  } catch (error) {
    res.status(500).json({ error: "Failed to decommission gadget" });
  }
});

// POST /gadgets/:id/self-destruct
router.post("/:id/self-destruct", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const confirmationCode = generateConfirmationCode(); // Random code generation
  // Confirm code (skipping actual validation for this example)
  res.json({
    message: "Self-destruct sequence triggered",
    code: confirmationCode,
  });
});

// POST /gadgets/:id/self-destruct
router.post("/:id/self-destruct", async (req, res) => {
  const { id } = req.params;

  // Generate a random confirmation code (6-digit code)
  const confirmationCode = Math.floor(100000 + Math.random() * 900000); // Random 6-digit code

  // Respond with the confirmation code
  res.json({
    message: "Self-destruct sequence triggered",
    confirmationCode: confirmationCode,
  });
});

function generateConfirmationCode() {
  return Math.floor(100000 + Math.random() * 900000); // Random 6-digit code
}

export { router as gadgetRouter };
