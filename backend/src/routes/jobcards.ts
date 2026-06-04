import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Get all job cards
router.get('/', async (req, res) => {
  try {
    const cards = await prisma.jobCard.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job cards' });
  }
});

// Get specific job card
router.get('/:id', async (req, res) => {
  try {
    const card = await prisma.jobCard.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        PartsUsed: true,
      },
    });
    if (!card) return res.status(404).json({ error: 'Job card not found' });
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job card' });
  }
});

// Create job card
router.post('/', async (req, res) => {
  try {
    const { customerId, tractorModel, issue, status, totalCost } = req.body;
    const card = await prisma.jobCard.create({
      data: { customerId, tractorModel, issue, status, totalCost },
    });
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job card' });
  }
});

// Update job card
router.put('/:id', async (req, res) => {
  try {
    const { tractorModel, issue, status, totalCost } = req.body;
    const card = await prisma.jobCard.update({
      where: { id: req.params.id },
      data: { tractorModel, issue, status, totalCost: parseFloat(totalCost) || 0 },
    });
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job card' });
  }
});

// Delete job card
router.delete('/:id', async (req, res) => {
  try {
    // Delete associated parts used first
    await prisma.partUsed.deleteMany({
      where: { jobCardId: req.params.id }
    });
    
    await prisma.jobCard.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete job card' });
  }
});

export default router;
