class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.statusCode = code;
  }
}
const fail = (code, message) => { throw new ApiError(code, message); };
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const reply = (res, statusCode, data) => res.status(statusCode).json({ status: 'success', data });
const message = (res, value) => res.status(200).json({ status: 'success', message: value });
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ status: 'failed', message: 'Format JSON tidak valid' });
  }
  if (err.code === '23505') return res.status(400).json({ status: 'failed', message: 'Data sudah terdaftar' });
  if (err.code === '23503' || err.code === '23514' || err.code === '22P02') {
    return res.status(400).json({ status: 'failed', message: 'Data referensi atau nilai tidak valid' });
  }
  const code = err.statusCode || 500;
  if (code === 500) console.error('[OpenJob server error]', err);
  return res.status(code).json({ status: 'failed', message: code === 500 ? 'Terjadi kesalahan server' : err.message });
}
module.exports = { ApiError, fail, wrap, reply, message, errorHandler };
