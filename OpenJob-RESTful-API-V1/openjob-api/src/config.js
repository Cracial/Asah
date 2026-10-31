require('dotenv').config();

const required = [
  'HOST', 'PORT', 'PGUSER', 'PGPASSWORD', 'PGDATABASE', 'PGHOST', 'PGPORT',
  'ACCESS_TOKEN_KEY', 'REFRESH_TOKEN_KEY',
];
function checkEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Variabel .env belum diatur: ${missing.join(', ')}`);
  if (process.env.ACCESS_TOKEN_KEY === process.env.REFRESH_TOKEN_KEY) {
    throw new Error('ACCESS_TOKEN_KEY dan REFRESH_TOKEN_KEY harus berbeda');
  }
}
module.exports = { checkEnv };
