const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: { role: 'VET' },
    data: { role: 'DOCTOR' }
  });
  console.log(`Successfully migrated ${result.count} doctors.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
