import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const firstNames = ['Amit', 'Rajesh', 'Suresh', 'Ramesh', 'Mukesh', 'Anil', 'Sunil', 'Vijay', 'Sanjay', 'Ajay', 'Deepak', 'Vikram', 'Prakash', 'Rahul', 'Rohit', 'Manish', 'Sachin', 'Naveen', 'Ashok', 'Karan'];
const lastNames = ['Sharma', 'Verma', 'Singh', 'Kumar', 'Yadav', 'Gupta', 'Patel', 'Chauhan', 'Rajput', 'Joshi'];
const tractorModels = ['Mahindra 575 DI', 'Swaraj 744 FE', 'Sonalika DI 745', 'John Deere 5310', 'Massey Ferguson 241 DI', 'New Holland 3630', 'Eicher 485', 'Kubota MU4501', 'Powertrac Euro 50'];
const issues = ['Oil change and general service', 'Brake issue', 'Clutch plate replacement', 'Engine noise', 'Hydraulic lift problem', 'Battery replacement', 'Tyre puncture', 'Alternator issue', 'Fuel pump repair'];
const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
const inventoryItems = [
  'Engine Oil 5L', 'Engine Oil 10L', 'Gear Oil 5L', 'Hydraulic Oil 10L', 'Air Filter', 'Oil Filter', 'Fuel Filter',
  'Clutch Plate', 'Pressure Plate', 'Brake Shoes', 'Brake Pads Set', 'Fan Belt', 'Alternator Belt', 'Radiator Coolant',
  'Water Pump', 'Fuel Injector', 'Head Gasket', 'Piston Rings', 'Connecting Rod', 'Main Bearing', 'Battery 12V 100Ah',
  'Headlight Bulb', 'Tail Light Cover', 'Ignition Switch', 'Starter Motor'
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Seeding massive data...');

  // Create Inventory items
  const createdInventory = [];
  for (const item of inventoryItems) {
    const costPrice = randomNumber(300, 2500);
    const price = Math.round(costPrice * 1.3); // 30% margin
    const quantity = randomNumber(5, 50);
    const inv = await prisma.inventory.upsert({
      where: { partName: item },
      update: { quantity: quantity, price: price, costPrice: costPrice },
      create: { partName: item, quantity: quantity, price: price, costPrice: costPrice },
    });
    createdInventory.push(inv);
  }
  console.log(`Created/Updated ${createdInventory.length} inventory items.`);

  // Create Customers
  const createdCustomers = [];
  for (let i = 0; i < 30; i++) {
    const phone = `98${randomNumber(10000000, 99999999)}`;
    const name = `${randomElement(firstNames)} ${randomElement(lastNames)}`;
    const cust = await prisma.customer.upsert({
      where: { phone: phone },
      update: {},
      create: { name: name, phone: phone, address: `Village ${randomElement(['Rampur', 'Shyam Nagar', 'Kishanpur', 'Lakshman Vihar', 'Sitapur'])}, Near Temple` },
    });
    createdCustomers.push(cust);
  }
  console.log(`Created ${createdCustomers.length} customers.`);

  // Create Suppliers
  const suppliers = [];
  for (let i = 1; i <= 5; i++) {
    const sup = await prisma.supplier.create({
      data: { name: `Auto Parts Supplier ${i}`, phone: `998877${randomNumber(1000, 9999)}`, address: 'Industrial Area' }
    });
    suppliers.push(sup);
  }
  console.log(`Created ${suppliers.length} suppliers.`);

  // Create Expenses
  for (let i = 0; i < 20; i++) {
    await prisma.expense.create({
      data: { 
        title: randomElement(['Electricity Bill', 'Tea and Snacks', 'Transport', 'Shop Rent', 'Stationery', 'Cleaning Materials']), 
        amount: randomNumber(100, 3000), 
        category: randomElement(['Utilities', 'Food', 'Transport', 'Rent', 'Miscellaneous']), 
        description: 'Auto-generated expense' 
      }
    });
  }
  console.log(`Created 20 expenses.`);

  // Create Job Cards
  for (let i = 0; i < 40; i++) {
    const customer = randomElement(createdCustomers);
    const totalCost = randomNumber(500, 8000);
    const item1 = randomElement(createdInventory);
    const item2 = randomElement(createdInventory);

    await prisma.jobCard.create({
      data: {
        customerId: customer.id,
        tractorModel: randomElement(tractorModels),
        issue: randomElement(issues),
        status: randomElement(statuses),
        totalCost: totalCost,
        PartsUsed: {
          create: [
            { partName: item1.partName, quantity: randomNumber(1, 3), price: item1.price },
            { partName: item2.partName, quantity: randomNumber(1, 2), price: item2.price }
          ]
        }
      }
    });
  }
  console.log(`Created 40 job cards.`);

  // Create Udhari (Credit)
  for (let i = 0; i < 15; i++) {
    const customer = randomElement(createdCustomers);
    await prisma.udhari.create({
      data: { 
        customerId: customer.id, 
        amount: randomNumber(500, 5000), 
        type: randomElement(['GIVEN', 'RECEIVED']), 
        description: 'Pending amount for spare parts' 
      }
    });
  }
  console.log(`Created 15 udhari records.`);

  console.log('Massive seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
