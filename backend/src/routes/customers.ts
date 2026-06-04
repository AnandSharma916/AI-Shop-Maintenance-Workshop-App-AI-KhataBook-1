import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        JobCards: true,
        Udhari: true,
        Documents: true,
      },
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create customer
router.post('/', async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const customer = await prisma.customer.create({
      data: { name, phone, address },
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: { name, phone, address },
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    // Delete associated Udhari and JobCards first due to foreign keys
    await prisma.udhari.deleteMany({ where: { customerId: req.params.id } });
    
    // We should also delete PartsUsed associated with JobCards, but Prisma's deleteMany on JobCards 
    // requires a bit of care. Let's find job cards first.
    const jobCards = await prisma.jobCard.findMany({ where: { customerId: req.params.id } });
    const jobCardIds = jobCards.map(jc => jc.id);
    await prisma.partUsed.deleteMany({ where: { jobCardId: { in: jobCardIds } } });
    await prisma.jobCard.deleteMany({ where: { customerId: req.params.id } });
    await prisma.customerDocument.deleteMany({ where: { customerId: req.params.id } });

    await prisma.customer.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Add document to customer
router.post('/:id/documents', async (req, res) => {
  try {
    const { title, photoUrl } = req.body;
    const doc = await prisma.customerDocument.create({
      data: {
        customerId: req.params.id,
        title,
        photoUrl
      }
    });
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add document' });
  }
});

// Delete document
router.delete('/documents/:docId', async (req, res) => {
  try {
    await prisma.customerDocument.delete({
      where: { id: req.params.docId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
