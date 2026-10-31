const express = require('express');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { authenticate, signAccess, signRefresh } = require('./auth');
const V = require('./validation');
const { wrap, fail, reply, message, errorHandler } = require('./errors');

const app = express();
app.disable('x-powered-by');
app.use(express.json());
const newId = (prefix) => `${prefix}-${crypto.randomUUID()}`;
const get = (query, values = []) => pool.query(query, values);
const mustFind = async (table, id, columns = '*') => {
  const allowed = ['users', 'companies', 'categories', 'jobs', 'applications', 'bookmarks'];
  if (!allowed.includes(table)) fail(500, 'Tabel tidak diizinkan');
  const { rows } = await get(`SELECT ${columns} FROM ${table} WHERE id = $1`, [id]);
  if (!rows.length) fail(404, 'Data tidak ditemukan');
  return rows[0];
};
const create = async (table, data, prefix) => {
  const keys = Object.keys(data);
  const cols = keys.map((x) => `"${x}"`).join(', ');
  const placeholders = keys.map((_, idx) => `$${idx + 2}`).join(', ');
  const id = newId(prefix);
  await get(`INSERT INTO ${table} (id, ${cols}) VALUES ($1, ${placeholders})`, [id, ...Object.values(data)]);
  return id;
};
const update = async (table, id, data) => {
  await mustFind(table, id);
  const keys = Object.keys(data);
  if (keys.length) await get(
    `UPDATE ${table} SET ${keys.map((key, n) => `"${key}" = $${n+2}`).join(', ')} WHERE id = $1`,
    [id, ...Object.values(data)],
  );
};
const remove = async (table, id) => {
  const r = await get(`DELETE FROM ${table} WHERE id = $1 RETURNING id`, [id]);
  if (!r.rowCount) fail(404, 'Data tidak ditemukan');
};

// USER: register dan melihat user tidak membutuhkan JWT.
app.post('/users', V.validate(V.user), wrap(async (req, res) => {
  const { name, email, password, role } = req.body;
  const safeEmail = email.toLowerCase();
  const exists = await get('SELECT id FROM users WHERE email = $1', [safeEmail]);
  if (exists.rowCount) fail(400, 'Email sudah digunakan');
  const hash = await bcrypt.hash(password, 12);
  const id = await create('users', { name, email: safeEmail, password: hash, role }, 'user');
  return reply(res, 201, { id });
}));
app.get('/users/:id', wrap(async (req, res) => {
  const user = await mustFind('users', req.params.id, 'id, name, email, role, created_at');
  return reply(res, 200, user);
}));

// AUTHENTICATION: dua jenis secret token yang berbeda, refresh token tersimpan di PG.
app.post('/authentications', V.validate(V.login), wrap(async (req, res) => {
  const { rows } = await get('SELECT id, password FROM users WHERE email = $1', [req.body.email.toLowerCase()]);
  if (!rows.length || !(await bcrypt.compare(req.body.password, rows[0].password))) {
    fail(401, 'Email atau password salah');
  }
  const userId = rows[0].id;
  const accessToken = signAccess(userId);
  const refreshToken = signRefresh(userId);
  await get('INSERT INTO authentications (token, user_id) VALUES ($1, $2)', [refreshToken, userId]);
  return reply(res, 200, { accessToken, refreshToken });
}));
app.put('/authentications', V.validate(V.token), wrap(async (req, res) => {
  const { refreshToken } = req.body;
  let payload;
  try { payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY); }
  catch { fail(400, 'Refresh token tidak valid'); }
  if (payload.type !== 'refresh' || typeof payload.id !== 'string') fail(400, 'Refresh token tidak valid');
  const { rows } = await get('SELECT user_id FROM authentications WHERE token = $1', [refreshToken]);
  if (!rows.length || rows[0].user_id !== payload.id) fail(400, 'Refresh token tidak terdaftar');
  return reply(res, 200, { accessToken: signAccess(payload.id) });
}));
app.delete('/authentications', authenticate, V.validate(V.token), wrap(async (req, res) => {
  const { refreshToken } = req.body;
  let payload;
  try { payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY); }
  catch { fail(400, 'Refresh token tidak valid'); }
  if (payload.type !== 'refresh') fail(400, 'Refresh token tidak valid');
  const result = await get('DELETE FROM authentications WHERE token = $1 RETURNING token', [refreshToken]);
  if (!result.rowCount) fail(400, 'Refresh token tidak terdaftar');
  return message(res, 'Logout berhasil');
}));

// COMPANIES.
app.get('/companies', wrap(async (req, res) => {
  const { rows } = await get('SELECT * FROM companies ORDER BY created_at DESC');
  return reply(res, 200, { companies: rows });
}));
app.get('/companies/:id', wrap(async (req, res) => reply(res, 200, await mustFind('companies', req.params.id))));
app.post('/companies', authenticate, V.validate(V.company), wrap(async (req, res) => {
  const id = await create('companies', req.body, 'company');
  return reply(res, 201, { id });
}));
app.put('/companies/:id', authenticate, V.validate(V.companyUpdate), wrap(async (req, res) => {
  await update('companies', req.params.id, req.body);
  return message(res, 'Perusahaan berhasil diperbarui');
}));
app.delete('/companies/:id', authenticate, wrap(async (req, res) => {
  await remove('companies', req.params.id);
  return message(res, 'Perusahaan berhasil dihapus');
}));

// CATEGORIES.
app.get('/categories', wrap(async (req, res) => {
  const { rows } = await get('SELECT * FROM categories ORDER BY created_at DESC');
  return reply(res, 200, { categories: rows });
}));
app.get('/categories/:id', wrap(async (req, res) => reply(res, 200, await mustFind('categories', req.params.id))));
app.post('/categories', authenticate, V.validate(V.category), wrap(async (req, res) => {
  const id = await create('categories', req.body, 'category');
  return reply(res, 201, { id });
}));
app.put('/categories/:id', authenticate, V.validate(V.category), wrap(async (req, res) => {
  await update('categories', req.params.id, req.body);
  return message(res, 'Kategori berhasil diperbarui');
}));
app.delete('/categories/:id', authenticate, wrap(async (req, res) => {
  await remove('categories', req.params.id);
  return message(res, 'Kategori berhasil dihapus');
}));

// JOBS: route company/category dipasang SEBELUM /jobs/:id.
const jobSelect = `SELECT j.*, c.name AS company_name, cat.name AS category_name
                   FROM jobs j JOIN companies c ON c.id = j.company_id
                   JOIN categories cat ON cat.id = j.category_id`;
app.get('/jobs', wrap(async (req, res) => {
  const where = [];
  const values = [];
  const title = typeof req.query.title === 'string' ? req.query.title.trim() : '';
  const company = typeof req.query['company-name'] === 'string' ? req.query['company-name'].trim() : '';
  if (title) { values.push(`%${title}%`); where.push(`j.title ILIKE $${values.length}`); }
  if (company) { values.push(`%${company}%`); where.push(`c.name ILIKE $${values.length}`); }
  const { rows } = await get(jobSelect + (where.length ? ` WHERE ${where.join(' AND ')}` : '') + ' ORDER BY j.created_at DESC', values);
  return reply(res, 200, { jobs: rows });
}));
app.get('/jobs/company/:companyId', wrap(async (req, res) => {
  const { rows } = await get(`${jobSelect} WHERE j.company_id = $1 ORDER BY j.created_at DESC`, [req.params.companyId]);
  return reply(res, 200, { jobs: rows });
}));
app.get('/jobs/category/:categoryId', wrap(async (req, res) => {
  const { rows } = await get(`${jobSelect} WHERE j.category_id = $1 ORDER BY j.created_at DESC`, [req.params.categoryId]);
  return reply(res, 200, { jobs: rows });
}));
app.get('/jobs/:id', wrap(async (req, res) => {
  const { rows } = await get(`${jobSelect} WHERE j.id = $1`, [req.params.id]);
  if (!rows.length) fail(404, 'Pekerjaan tidak ditemukan');
  return reply(res, 200, rows[0]);
}));
app.post('/jobs', authenticate, V.validate(V.job), wrap(async (req, res) => {
  await mustFind('companies', req.body.company_id);
  await mustFind('categories', req.body.category_id);
  const id = await create('jobs', req.body, 'job');
  return reply(res, 201, { id });
}));
app.put('/jobs/:id', authenticate, V.validate(V.jobUpdate), wrap(async (req, res) => {
  if (req.body.company_id) await mustFind('companies', req.body.company_id);
  if (req.body.category_id) await mustFind('categories', req.body.category_id);
  await update('jobs', req.params.id, req.body);
  return message(res, 'Pekerjaan berhasil diperbarui');
}));
app.delete('/jobs/:id', authenticate, wrap(async (req, res) => {
  await remove('jobs', req.params.id);
  return message(res, 'Pekerjaan berhasil dihapus');
}));

// APPLICATIONS. Endpoint daftar tetap protected sesuai collection.
app.post('/applications', authenticate, V.validate(V.application), wrap(async (req, res) => {
  await mustFind('users', req.body.user_id, 'id');
  await mustFind('jobs', req.body.job_id, 'id');
  if (req.body.user_id !== req.user.id) fail(403, 'Tidak boleh melamar untuk pengguna lain');
  const id = await create('applications', req.body, 'application');
  return reply(res, 201, { id });
}));
app.get('/applications', authenticate, wrap(async (req, res) => {
  const { rows } = await get('SELECT * FROM applications ORDER BY created_at DESC');
  return reply(res, 200, { applications: rows });
}));
app.get('/applications/user/:userId', authenticate, wrap(async (req, res) => {
  const { rows } = await get('SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC', [req.params.userId]);
  return reply(res, 200, { applications: rows });
}));
app.get('/applications/job/:jobId', authenticate, wrap(async (req, res) => {
  const { rows } = await get('SELECT * FROM applications WHERE job_id = $1 ORDER BY created_at DESC', [req.params.jobId]);
  return reply(res, 200, { applications: rows });
}));
app.get('/applications/:id', authenticate, wrap(async (req, res) => reply(res, 200, await mustFind('applications', req.params.id))));
app.put('/applications/:id', authenticate, V.validate(V.applicationUpdate), wrap(async (req, res) => {
  await update('applications', req.params.id, req.body);
  return message(res, 'Lamaran berhasil diperbarui');
}));
app.delete('/applications/:id', authenticate, wrap(async (req, res) => {
  await remove('applications', req.params.id);
  return message(res, 'Lamaran berhasil dihapus');
}));

// BOOKMARKS: route spesifik harus dipasang dengan path /jobs/:jobId/bookmark.
app.post('/jobs/:jobId/bookmark', authenticate, wrap(async (req, res) => {
  await mustFind('jobs', req.params.jobId, 'id');
  const exists = await get('SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2', [req.user.id, req.params.jobId]);
  if (exists.rowCount) fail(400, 'Pekerjaan sudah disimpan');
  const id = await create('bookmarks', { user_id: req.user.id, job_id: req.params.jobId }, 'bookmark');
  return reply(res, 201, { id });
}));
app.get('/bookmarks', authenticate, wrap(async (req, res) => {
  const { rows } = await get('SELECT * FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
  return reply(res, 200, { bookmarks: rows });
}));
app.get('/jobs/:jobId/bookmark/:id', authenticate, wrap(async (req, res) => {
  const { rows } = await get('SELECT * FROM bookmarks WHERE id = $1 AND job_id = $2 AND user_id = $3', [req.params.id, req.params.jobId, req.user.id]);
  if (!rows.length) fail(404, 'Bookmark tidak ditemukan');
  return reply(res, 200, rows[0]);
}));
app.delete('/jobs/:jobId/bookmark', authenticate, wrap(async (req, res) => {
  const r = await get('DELETE FROM bookmarks WHERE job_id = $1 AND user_id = $2 RETURNING id', [req.params.jobId, req.user.id]);
  if (!r.rowCount) fail(404, 'Bookmark tidak ditemukan');
  return message(res, 'Bookmark berhasil dihapus');
}));

// PROFILE: identitas selalu berasal dari access token, bukan user_id request.
app.get('/profile', authenticate, wrap(async (req, res) => reply(res, 200, req.user)));
app.get('/profile/applications', authenticate, wrap(async (req, res) => {
  const { rows } = await get('SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
  return reply(res, 200, { applications: rows });
}));
app.get('/profile/bookmarks', authenticate, wrap(async (req, res) => {
  const { rows } = await get('SELECT * FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
  return reply(res, 200, { bookmarks: rows });
}));

app.use((req, res) => res.status(404).json({ status: 'failed', message: 'Endpoint tidak ditemukan' }));
app.use(errorHandler);
module.exports = app;
