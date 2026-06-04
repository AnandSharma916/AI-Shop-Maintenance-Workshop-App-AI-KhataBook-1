import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const firstNames = ['Ramesh', 'Suresh', 'Dinesh', 'Kishan', 'Mukesh', 'Rajesh', 'Kamlesh', 'Faizan', 'Anmol', 'Vikram', 'Prakash', 'Amit', 'Sunil', 'Anil', 'Manoj', 'Deepak', 'Sanjay', 'Rahul', 'Mohit', 'Vinod'];
const lastNames = ['Patel', 'Singh', 'Kumar', 'Sharma', 'Yadav', 'Verma', 'Choudhary', 'Rajput', 'Mishra', 'Tiwari'];
const villages = ['Village Rampur', 'Village Paldi', 'Ward 5, Main Market', 'Near Bus Stand', 'Highway Road', 'South District', 'Village Khedi', 'North Sector', 'Village Madhopur', 'Station Road'];
const tractorModels = ['Mahindra 575 DI', 'Swaraj 744 FE', 'Sonalika DI 745', 'John Deere 5310', 'Eicher 380', 'Massey Ferguson 241', 'New Holland 3230', 'Powertrac Euro 50', 'Farmtrac 60', 'Kubota MU4501'];
const issues = ['Engine overhaul', 'Oil change', 'Clutch issue', 'Hydraulic pump failure', 'Brake repair', 'Lights check', 'Gearbox grinding', 'Radiator leak', 'Tyre replacement', 'Battery dead', 'Starter motor repair', 'Alternator issue'];
const parts = [
  { name: 'Engine Oil 5L', price: 1200 }, { name: 'Air Filter', price: 450 }, { name: 'Clutch Plate', price: 3500 },
  { name: 'Brake Shoe', price: 850 }, { name: 'Hydraulic Pump', price: 12500 }, { name: 'Tractor Battery 12V', price: 4500 },
  { name: 'Headlight Bulb', price: 150 }, { name: 'Gear Oil 5L', price: 1100 }, { name: 'Coolant 1L', price: 250 },
  { name: 'Fuel Filter', price: 300 }, { name: 'Alternator Belt', price: 200 }, { name: 'Water Pump', price: 1800 }
];

function getRandom(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Clearing old data...');
  await prisma.partUsed.deleteMany();
  await prisma.jobCard.deleteMany();
  await prisma.udhari.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.customer.deleteMany();

  console.log('Generating Inventory...');
  for (const part of parts) {
    await prisma.inventory.create({
      data: {
        partName: part.name,
        quantity: getRandomInt(5, 50),
        price: part.price,
        minStock: getRandomInt(2, 10)
      }
    });
  }

  console.log('Generating 35 Customers...');
  const customers = [];
  for (let i = 0; i < 35; i++) {
    const c = await prisma.customer.create({
      data: {
        name: `${getRandom(firstNames)} ${getRandom(lastNames)}`,
        phone: `98${getRandomInt(10000000, 99999999)}`,
        address: getRandom(villages),
      }
    });
    customers.push(c);
  }

  console.log('Generating 80 Job Cards & Udhari Records...');
  for (let i = 0; i < 80; i++) {
    const customer = getRandom(customers);
    const p1 = getRandom(parts);
    const p2 = getRandom(parts);
    
    // Random past date within last 60 days
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - getRandomInt(1, 60));

    // Job Card
    await prisma.jobCard.create({
      data: {
        customerId: customer.id,
        tractorModel: getRandom(tractorModels),
        issue: getRandom(issues),
        status: getRandom(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'COMPLETED']),
        totalCost: p1.price + p2.price + getRandomInt(500, 2000), // parts + labor
        createdAt: pastDate,
        PartsUsed: {
          create: [
            { partName: p1.name, quantity: 1, price: p1.price },
            { partName: p2.name, quantity: getRandomInt(1, 2), price: p2.price }
          ]
        }
      }
    });

    // Udhari (Credit)
    await prisma.udhari.create({
      data: {
        customerId: customer.id,
        amount: getRandomInt(500, 5000),
        type: 'CREDIT',
        description: `Pending for ${getRandom(issues)}`,
        date: pastDate
      }
    });

    // Udhari (Payment - 70% chance)
    if (Math.random() > 0.3) {
      const paymentDate = new Date(pastDate);
      paymentDate.setDate(paymentDate.getDate() + getRandomInt(1, 10));
      await prisma.udhari.create({
        data: {
          customerId: customer.id,
          amount: getRandomInt(500, 3000),
          type: 'PAYMENT',
          description: 'Cash payment received',
          date: paymentDate
        }
      });
    }
  }

  console.log('Generating 30 Expenses...');
  const expenseCategories = ['WAGES', 'BILLS', 'SUPPLIES', 'FOOD', 'OTHER'];
  const expenseTitles = ['Mechanic Fajan Wage', 'Mechanic Anmol Wage', 'Tea & Samosa', 'Electricity Bill', 'New Spanners', 'Shop Rent', 'Water Bottle 20L', 'Diesel for GenSet'];
  for (let i = 0; i < 30; i++) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - getRandomInt(1, 30));
    const title = getRandom(expenseTitles);
    
    let cat = 'OTHER';
    if (title.includes('Wage')) cat = 'WAGES';
    if (title.includes('Tea') || title.includes('Water')) cat = 'FOOD';
    if (title.includes('Bill') || title.includes('Rent')) cat = 'BILLS';
    if (title.includes('Spanner') || title.includes('Diesel')) cat = 'SUPPLIES';

    await prisma.expense.create({
      data: {
        title,
        amount: getRandomInt(100, 3000),
        category: cat,
        description: 'Routine expense',
        date: pastDate
      }
    });
  }

  console.log('Massive seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
