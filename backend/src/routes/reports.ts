import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const jobCards = await prisma.jobCard.findMany();
    const expenses = await prisma.expense.findMany();
    const udhari = await prisma.udhari.findMany();
    const inventory = await prisma.inventory.findMany();

    const totalRevenue = jobCards.reduce((acc, jc) => acc + jc.totalCost, 0);
    const totalExpenses = expenses.reduce((acc, ex) => acc + ex.amount, 0);
    
    // Calculate pending udhari
    const credit = udhari.filter(u => u.type === 'CREDIT').reduce((acc, u) => acc + u.amount, 0);
    const payment = udhari.filter(u => u.type === 'PAYMENT').reduce((acc, u) => acc + u.amount, 0);
    const pendingUdhari = credit - payment;

    // Calculate Inventory Value
    const inventoryValue = inventory.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const inventoryCost = inventory.reduce((acc, item) => acc + (item.quantity * item.costPrice), 0);

    // Format for bar chart (last 7 days logic simplified for demo)
    res.json({
      summary: {
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        pendingUdhari,
        inventoryValue,
        inventoryCost
      },
      expenseByCategory: expenses.reduce((acc: any, ex) => {
        acc[ex.category] = (acc[ex.category] || 0) + ex.amount;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate reports' });
  }
});

export default router;
