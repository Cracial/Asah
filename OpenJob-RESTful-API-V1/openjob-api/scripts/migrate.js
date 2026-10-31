// Membentuk DATABASE_URL dari variabel PG* sesuai kriteria Dicoding,
// tanpa menambahkan kredensial ke source code.
require('dotenv').config();
const { spawnSync } = require('child_process');
const path = require('path');
const { checkEnv } = require('../src/config');
checkEnv();
const user = encodeURIComponent(process.env.PGUSER);
const password = encodeURIComponent(process.env.PGPASSWORD);
const database = encodeURIComponent(process.env.PGDATABASE);
const host = process.env.PGHOST;
const port = process.env.PGPORT;
const url = `postgresql://${user}:${password}@${host}:${port}/${database}`;
const cli = path.resolve(__dirname, '../node_modules/node-pg-migrate/bin/node-pg-migrate.js');
const args = process.argv.slice(2);
const result = spawnSync(process.execPath, [cli, ...args.length ? args : ['up']], {
  stdio: 'inherit', env: { ...process.env, DATABASE_URL: url },
});
if (result.error) { console.error(result.error.message); process.exit(1); }
process.exit(result.status ?? 1);
