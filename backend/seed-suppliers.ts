import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const billPhotoUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'; // Realistic looking bill/invoice photo

const suppliersData = [
  { name: 'Sharma Auto Parts', phone: '9876543211', address: 'MP Nagar, Bhopal' },
  { name: 'Gupta Motors', phone: '9876543212', address: 'BHEL, Bhopal' },
  { name: 'Verma Tractor Spares', phone: '9876543213', address: 'Kolar Road, Bhopal' },
  { name: 'Indore Auto Hub', phone: '9876543214', address: 'Vijay Nagar, Indore' },
  { name: 'Malwa Spare Parts', phone: '9876543215', address: 'Palasia, Indore' },
  { name: 'Chouhan Traders', phone: '9876543216', address: 'Bhawarkua, Indore' }
];

const items = ['Engine Oil 50L Drum', 'Clutch Plates Bulk', 'Hydraulic Pumps', 'Tractor Tires x4', 'Gearbox Spares', 'Battery Set', 'Filter Kits'];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log('Clearing old suppliers...');
  await prisma.supplierBill.deleteMany();
  await prisma.supplier.deleteMany();

  console.log('Generating Vayparis (Bhopal & Indore)...');
  
  for (const sData of suppliersData) {
    const supplier = await prisma.supplier.create({
      data: sData
    });

    console.log(`Added supplier: ${supplier.name}`);

    // Create 2-4 bills for each supplier
    const numBills = getRandomInt(2, 4);
    for (let i = 0; i < numBills; i++) {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - getRandomInt(1, 45));

      await prisma.supplierBill.create({
        data: {
          supplierId: supplier.id,
          amount: getRandomInt(5000, 45000),
          status: Math.random() > 0.4 ? 'UNPAID' : 'PAID', // 60% unpaid
          description: `Bulk purchase of ${getRandom(items)}`,
          photoUrl: billPhotoUrl,
          date: pastDate
        }
      });
    }
  }

  console.log('Vaypari seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
