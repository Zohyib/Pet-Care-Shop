const { execSync } = require('child_process');
const fs = require('fs');
try {
  execSync('npx prisma validate', { encoding: 'utf-8', stdio: 'pipe' });
} catch (e) {
  let err = (e.stderr || '') + '\n' + (e.stdout || '');
  fs.writeFileSync('err.txt', err);
}
