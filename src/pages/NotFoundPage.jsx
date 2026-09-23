import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="not-found">
      <h2>404</h2>
      <p>Halaman tidak ditemukan.</p>
      <Link to="/">Kembali ke Halaman Utama</Link>
    </section>
  );
}

export default NotFoundPage;