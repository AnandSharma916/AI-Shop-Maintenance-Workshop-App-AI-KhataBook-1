import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await prisma.inventory.findMany({
      orderBy: { partName: 'asc' },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Create inventory item
router.post('/', async (req, res) => {
  try {
    const { partName, quantity, price, costPrice, minStock } = req.body;
    const item = await prisma.inventory.create({
      data: { partName, quantity, price, costPrice: costPrice || 0, minStock },
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  try {
    const { partName, quantity, price, costPrice, minStock } = req.body;
    const item = await prisma.inventory.update({
      where: { id: req.params.id },
      data: { partName, quantity, price, costPrice: costPrice || 0, minStock },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    await prisma.inventory.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

export default router;
