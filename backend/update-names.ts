import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating names...');

  // Update Ramesh -> Fajan
  const rameshExpenses = await prisma.expense.findMany({
    where: { title: { contains: 'Ramesh' } }
  });
  for (const exp of rameshExpenses) {
    await prisma.expense.update({
      where: { id: exp.id },
      data: {
        title: exp.title.replace('Ramesh', 'Fajan'),
        description: exp.description?.replace('Ramesh', 'Fajan')
      }
    });
  }

  // Update Suresh -> Anmol
  const sureshExpenses = await prisma.expense.findMany({
    where: { title: { contains: 'Suresh' } }
  });
  for (const exp of sureshExpenses) {
    await prisma.expense.update({
      where: { id: exp.id },
      data: {
        title: exp.title.replace('Suresh', 'Anmol'),
        description: exp.description?.replace('Suresh', 'Anmol')
      }
    });
  }

  console.log('Names updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
