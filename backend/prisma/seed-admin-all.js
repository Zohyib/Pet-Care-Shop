const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

// Try all suspected db paths
const dbPaths = [
  path.join(__dirname, 'dev.db'),
  path.join(__dirname, 'prisma', 'dev.db'),
  path.join(__dirname, '..', 'dev.db'),
  path.join(__dirname, '..', 'prisma', 'dev.db'),
  path.join(__dirname, '..', '..', 'dev.db')
];

async function run() {
  const email = 'admin@petcare.com';
  const password = 'adminpassword123';
  const name = 'System Admin';
  const hashedPassword = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();

  for (const dbPath of dbPaths) {
    try {
      const db = new Database(dbPath, { fileMustExist: true });
      console.log(`Checking database at: ${dbPath}`);
      
      // Check if table exists
      const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='User'").get();
      if (!tableCheck) {
        console.log(`Table User does not exist in ${dbPath}, skipping.`);
        db.close();
        continue;
      }

      const existing = db.prepare('SELECT * FROM User WHERE email = ?').get(email);

      if (existing) {
        console.log(`Admin user already exists in ${dbPath}. Updating password just in case.`);
        db.prepare('UPDATE User SET password = ?, role = ?, status = ? WHERE email = ?')
          .run(hashedPassword, 'ADMIN', 'ACTIVE', email);
      } else {
        const id = require('crypto').randomUUID();
        db.prepare(`
          INSERT INTO User (id, email, password, name, role, status, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(id, email, hashedPassword, name, 'ADMIN', 'ACTIVE', now);
        console.log(`Admin user created successfully in ${dbPath}!`);
      }
      db.close();
    } catch (e) {
      // console.log(`Error or not found at: ${dbPath}`);
    }
  }
}

run();
