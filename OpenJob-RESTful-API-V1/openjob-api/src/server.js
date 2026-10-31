require('dotenv').config();
const { checkEnv } = require('./config');
const pool = require('./db');
const app = require('./app');

async function start() {
  checkEnv();
  await pool.query('SELECT 1');
  const host = process.env.HOST;
  const port = Number(process.env.PORT);
  app.listen(port, host, () => {
    console.log(`OpenJob RESTful API V1 berjalan di http://${host}:${port}`);
  });
}
start().catch((err) => {
  console.error('OpenJob API gagal dijalankan:', err.message);
  process.exit(1);
});
