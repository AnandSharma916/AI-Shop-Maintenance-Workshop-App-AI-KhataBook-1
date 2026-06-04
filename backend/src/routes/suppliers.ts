import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all suppliers with bills
router.get('/', async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: { Bills: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// Create a supplier
router.post('/', async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const supplier = await prisma.supplier.create({
      data: { name, phone, address }
    });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

// Add a bill to supplier
router.post('/:id/bills', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, photoUrl } = req.body;
    
    const bill = await prisma.supplierBill.create({
      data: {
        supplierId: id,
        amount: parseFloat(amount),
        description,
        photoUrl
      }
    });
    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add bill' });
  }
});

// Pay a bill
router.put('/bills/:billId/pay', async (req, res) => {
  try {
    const { billId } = req.params;
    const bill = await prisma.supplierBill.update({
      where: { id: billId },
      data: { status: 'PAID' }
    });
    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bill' });
  }
});

export default router;
