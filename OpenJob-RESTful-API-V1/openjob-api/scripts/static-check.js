// Pengujian statis yang tidak membutuhkan database/dependencies.
const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const base = path.resolve(__dirname, '..');
const files = ['src/server.js','src/app.js','src/auth.js','src/db.js','src/config.js','src/errors.js','src/validation.js','scripts/migrate.js'];
for (const file of files) {
  const result = cp.spawnSync(process.execPath, ['--check', path.join(base, file)], { stdio:'pipe' });
  if (result.status !== 0) throw new Error(`${file}: ${result.stderr.toString()}`);
  console.log(`OK ${file}`);
}
const migrations = fs.readdirSync(path.join(base, 'migrations')).filter((name) => /^\d{13}_.+\.js$/.test(name));
if (!migrations.length) throw new Error('Migration bertimestamp tidak ditemukan');
for (const migration of migrations) {
  const file = path.join(base, 'migrations', migration);
  const result = cp.spawnSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  if (result.status !== 0) throw new Error(`Migration ${migration}: ${result.stderr.toString()}`);
}
console.log('OK migration bertimestamp:', migrations.join(', '));
