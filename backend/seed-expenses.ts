import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dummy expenses...');

  await prisma.expense.createMany({
    data: [
      { title: 'Mechanic Ramesh Wage', amount: 500, category: 'WAGES', description: 'Daily wage for Ramesh' },
      { title: 'Mechanic Suresh Wage', amount: 450, category: 'WAGES', description: 'Daily wage for Suresh' },
      { title: 'Morning Tea and Snacks', amount: 60, category: 'FOOD', description: 'Tea from corner stall' },
      { title: 'Electricity Bill', amount: 2500, category: 'BILLS', description: 'Month of May' },
      { title: 'Cleaning Supplies', amount: 150, category: 'SUPPLIES', description: 'Soap and cloth' },
      { title: 'Evening Tea', amount: 40, category: 'FOOD', description: '' },
      { title: 'Workshop Rent', amount: 5000, category: 'BILLS', description: 'Monthly rent paid to landlord' }
    ]
  });

  console.log('Expenses seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
