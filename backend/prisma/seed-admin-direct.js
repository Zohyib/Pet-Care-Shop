const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

// Try all suspected db paths
const dbPaths = [
  path.join(__dirname, 'dev.db'),
  path.join(__dirname, 'prisma', 'dev.db'),
  path.join(__dirname, '..', 'dev.db')
];

let db;
for (const dbPath of dbPaths) {
  try {
    db = new Database(dbPath, { fileMustExist: true });
    console.log(`Using database at: ${dbPath}`);
    break;
  } catch (e) {
    // console.log(`Not found at: ${dbPath}`);
  }
}

if (!db) {
  console.log('Could not find a valid dev.db file. Creating a new one at prisma/dev.db');
  db = new Database(path.join(__dirname, 'dev.db'));
}

async function run() {
  try {
    // Create User table if it doesn't exist (safety)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "name" TEXT NOT NULL,
        "phone" TEXT,
        "avatarUrl" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      )
    `).run();

    const email = 'admin@petcare.com';
    const password = 'adminpassword123';
    const name = 'System Admin';

    const existing = db.prepare('SELECT * FROM User WHERE email = ?').get(email);

    if (existing) {
      console.log('Admin user already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = require('crypto').randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO User (id, email, password, name, role, status, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, email, hashedPassword, name, 'ADMIN', 'ACTIVE', now);

    console.log('Admin user created successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    db.close();
  }
}

run();
