const jwt = require('jsonwebtoken');
const pool = require('./db');
const { wrap, fail } = require('./errors');

const signAccess = (id) => jwt.sign({ id, type: 'access' }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '3h' });
const signRefresh = (id) => jwt.sign({ id, type: 'refresh' }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
const authenticate = wrap(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !/^Bearer\s+\S+$/.test(header)) fail(401, 'Token autentikasi diperlukan');
  let payload;
  try { payload = jwt.verify(header.slice(7).trim(), process.env.ACCESS_TOKEN_KEY); }
  catch { fail(401, 'Access token tidak valid atau sudah kedaluwarsa'); }
  if (payload.type !== 'access' || typeof payload.id !== 'string') fail(401, 'Access token tidak valid');
  const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [payload.id]);
  if (!result.rowCount) fail(401, 'Pengguna tidak ditemukan');
  req.user = result.rows[0];
  next();
});
module.exports = { authenticate, signAccess, signRefresh };
