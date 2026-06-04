import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Clear existing data
  await prisma.partUsed.deleteMany();
  await prisma.jobCard.deleteMany();
  await prisma.udhari.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.customer.deleteMany();

  // 2. Create Customers
  console.log('Creating customers...');
  const c1 = await prisma.customer.create({
    data: { name: 'Ramesh Patel', phone: '9876543210', address: 'Village Rampur' }
  });
  const c2 = await prisma.customer.create({
    data: { name: 'Suresh Kumar', phone: '9876543211', address: 'Ward 5, Main Market' }
  });
  const c3 = await prisma.customer.create({
    data: { name: 'Dinesh Singh', phone: '9876543212', address: 'Near Bus Stand' }
  });
  const c4 = await prisma.customer.create({
    data: { name: 'Raju Mechanic', phone: '9876543213', address: 'Highway Road' }
  });
  const c5 = await prisma.customer.create({
    data: { name: 'Kishan Lal', phone: '9876543214', address: 'South District' }
  });

  // 3. Create Inventory
  console.log('Creating inventory...');
  await prisma.inventory.createMany({
    data: [
      { partName: 'Engine Oil 5L', quantity: 20, price: 1200, minStock: 5 },
      { partName: 'Air Filter', quantity: 15, price: 450, minStock: 10 },
      { partName: 'Clutch Plate', quantity: 8, price: 3500, minStock: 3 },
      { partName: 'Brake Shoe', quantity: 25, price: 850, minStock: 10 },
      { partName: 'Hydraulic Pump', quantity: 2, price: 12500, minStock: 1 },
      { partName: 'Tractor Battery 12V', quantity: 5, price: 4500, minStock: 2 },
      { partName: 'Headlight Bulb', quantity: 50, price: 150, minStock: 20 },
    ]
  });

  // 4. Create Job Cards
  console.log('Creating job cards...');
  await prisma.jobCard.create({
    data: {
      customerId: c1.id,
      tractorModel: 'Mahindra 575 DI',
      issue: 'Engine overhaul and oil change',
      status: 'IN_PROGRESS',
      totalCost: 5500,
      PartsUsed: {
        create: [
          { partName: 'Engine Oil 5L', quantity: 1, price: 1200 },
          { partName: 'Air Filter', quantity: 1, price: 450 }
        ]
      }
    }
  });

  await prisma.jobCard.create({
    data: {
      customerId: c2.id,
      tractorModel: 'Swaraj 744 FE',
      issue: 'Clutch issue',
      status: 'COMPLETED',
      totalCost: 4500,
      PartsUsed: {
        create: [
          { partName: 'Clutch Plate', quantity: 1, price: 3500 }
        ]
      }
    }
  });

  await prisma.jobCard.create({
    data: {
      customerId: c3.id,
      tractorModel: 'Sonalika DI 745',
      issue: 'Hydraulic pump failure',
      status: 'PENDING',
      totalCost: 13500,
      PartsUsed: {
        create: [
          { partName: 'Hydraulic Pump', quantity: 1, price: 12500 }
        ]
      }
    }
  });

  await prisma.jobCard.create({
    data: {
      customerId: c4.id,
      tractorModel: 'John Deere 5310',
      issue: 'Brake repair and lights check',
      status: 'COMPLETED',
      totalCost: 2000,
      PartsUsed: {
        create: [
          { partName: 'Brake Shoe', quantity: 2, price: 850 },
          { partName: 'Headlight Bulb', quantity: 2, price: 150 }
        ]
      }
    }
  });

  // 5. Create Udhari (Ledger)
  console.log('Creating Udhari records...');
  await prisma.udhari.createMany({
    data: [
      { customerId: c1.id, amount: 2500, type: 'CREDIT', description: 'Pending for engine repair' },
      { customerId: c1.id, amount: 1000, type: 'PAYMENT', description: 'Cash paid' },
      { customerId: c2.id, amount: 4500, type: 'CREDIT', description: 'Clutch plate replacement' },
      { customerId: c3.id, amount: 15000, type: 'CREDIT', description: 'Hydraulic pump and labor' },
      { customerId: c3.id, amount: 5000, type: 'PAYMENT', description: 'Advance payment received' },
      { customerId: c5.id, amount: 800, type: 'CREDIT', description: 'Spare parts taken' },
    ]
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
