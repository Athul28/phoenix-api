import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const router = express.Router();

// GET /gadgets
router.get('/', async (req, res) => {
  try {
    const gadgets = await prisma.gadget.findMany();
    res.json(gadgets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gadgets' });
  }
});

// POST /gadgets
router.post('/', async (req, res) => {
  const { name } = req.body;
  const codename = generateCodename(); // Random codename generation
  const gadget = await prisma.gadget.create({
    data: { name, status: 'Available' },
  });
  res.status(201).json(gadget);
});

// PATCH /gadgets/:id
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  try {
    const gadget = await prisma.gadget.update({
      where: { id },
      data: { name, status },
    });
    res.json(gadget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update gadget' });
  }
});

// DELETE /gadgets/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const gadget = await prisma.gadget.update({
      where: { id },
      data: { status: 'Decommissioned', decommissionedAt: new Date() },
    });
    res.json(gadget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to decommission gadget' });
  }
});

// POST /gadgets/:id/self-destruct
router.post('/:id/self-destruct', async (req, res) => {
  const { id } = req.params;
  const confirmationCode = generateConfirmationCode(); // Random code generation
  // Confirm code (skipping actual validation for this example)
  res.json({ message: 'Self-destruct sequence triggered', code: confirmationCode });
});

function generateCodename() {
  const codenames = ['The Nightingale', 'The Kraken', 'The Phoenix'];
  return codenames[Math.floor(Math.random() * codenames.length)];
}

function generateConfirmationCode() {
  return Math.floor(100000 + Math.random() * 900000); // Random 6-digit code
}

export { router as gadgetRouter };
