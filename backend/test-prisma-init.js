require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
console.log('Got PrismaClient');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
});

prisma.$connect()
  .then(() => {
    console.log('Connected natively!');
    return prisma.user.findMany();
  })
  .then(users => {
    console.log('Users found:', users.length);
    process.exit(0);
  })
  .catch(e => {
    console.error('Error natively:', e.constructor.name, e.message);
    process.exit(1);
  });
