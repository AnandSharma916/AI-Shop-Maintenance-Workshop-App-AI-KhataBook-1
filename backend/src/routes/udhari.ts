import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Get all udhari records
router.get('/', async (req, res) => {
  try {
    const records = await prisma.udhari.findMany({
      include: { customer: true },
      orderBy: { date: 'desc' },
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch udhari records' });
  }
});

// Create udhari record
router.post('/', async (req, res) => {
  try {
    const { customerId, amount, type, description } = req.body;
    const record = await prisma.udhari.create({
      data: { customerId, amount: parseFloat(amount), type, description },
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create udhari record' });
  }
});

// Update udhari record
router.put('/:id', async (req, res) => {
  try {
    const { amount, type, description } = req.body;
    const record = await prisma.udhari.update({
      where: { id: req.params.id },
      data: { amount: parseFloat(amount), type, description },
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update udhari record' });
  }
});

// Delete udhari record
router.delete('/:id', async (req, res) => {
  try {
    await prisma.udhari.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete udhari record' });
  }
});

export default router;
