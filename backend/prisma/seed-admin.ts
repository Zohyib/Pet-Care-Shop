import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@petcare.com';
  const password = 'adminpassword123';
  const name = 'System Admin';

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log('Admin user already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log(`Admin user created!`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
