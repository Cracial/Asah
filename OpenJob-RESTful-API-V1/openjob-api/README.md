# OpenJob RESTful API Versi 1

Proyek back-end **JavaScript + Express.js + PostgreSQL** berdasarkan collection resmi `[271] OpenJob API Test V1.postman_collection.json` yang diunggah pengguna.

## Fitur

- 7 tabel PostgreSQL dengan foreign key dan migration `node-pg-migrate` bertimestamp.
- Endpoint Users, Companies, Categories, Jobs, Applications, Bookmarks, Authentications, dan Profile.
- Registrasi menggunakan `bcryptjs`, login menggunakan JWT, refresh token tersimpan di PostgreSQL.
- Access token berlaku **3 jam**. Refresh token berlaku 7 hari (kebijakan proyek).
- Input validation Joi, middleware JWT, dan error handler JSON.
- Pencarian `GET /jobs?title=...&company-name=...` menggunakan `ILIKE`.
- ERD `ERD-OpenJob-versi-1.png` sesuai ketentuan penilaian Advanced.

## Persyaratan

- Node.js **22 LTS**
- PostgreSQL berjalan di komputer dan user database memiliki izin membuat tabel
- Postman (untuk menguji seluruh collection)

## Setup Windows PowerShell

1. Ekstrak folder proyek ke lokasi pilihan Anda, lalu buka terminal dari folder yang berisi `package.json`.
2. Buat database bernama `openjob_db` melalui pgAdmin atau jalankan SQL `CREATE DATABASE openjob_db;` menggunakan user PostgreSQL yang punya hak akses.
3. Salin `.env.example` menjadi `.env`. Edit `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGHOST`, `PGPORT`, `HOST`, `PORT`, `ACCESS_TOKEN_KEY`, dan `REFRESH_TOKEN_KEY` sesuai kondisi komputer. Kedua secret key JWT harus berbeda dan panjang/acak.
4. Jalankan:

```powershell
npm install
npm run migrate:up
npm run start:dev
```

API akan berjalan di **http://localhost:3000** jika `.env` menggunakan nilai `HOST=localhost` dan `PORT=3000`.

> **Penting:** Untuk submission Dicoding, proyek menggunakan PostgreSQL, bukan SQLite/MongoDB. Jalankan migration sebelum menjalankan server. Jangan mengunggah `.env` asli. `.env.example` boleh dilampirkan.

## Menjalankan Postman Collection

1. Ekstrak file **OpenJob RESTful API V1 Test.zip** resmi Dicoding.
2. Import collection `[271] OpenJob API Test V1.postman_collection.json` dan environment `OpenJob API.postman_environment.json`.
3. Pilih environment OpenJob, pastikan variabel `port = 3000` (atau sesuai PORT Anda).
4. Jalankan **collection runner** dari atas ke bawah tanpa mengubah urutan item.
5. Periksa seluruh assertion mandatory dan optional. Pengujian sebaiknya dijalankan pada database baru atau database yang di-reset untuk menghindari email duplikat pada registrasi.

File collection tidak dimasukkan ke ZIP sumber proyek ini; gunakan file resmi yang sudah dimiliki.

## Contoh HTTP API

```http
POST http://localhost:3000/users
Content-Type: application/json

{"name":"John Doe","email":"john@example.com","password":"password123","role":"user"}
```

```http
POST http://localhost:3000/authentications
Content-Type: application/json

{"email":"john@example.com","password":"password123"}
```

Response autentikasi akan berisi `data.accessToken` dan `data.refreshToken`. Gunakan `Authorization: Bearer <accessToken>` untuk endpoint terproteksi.

```http
GET http://localhost:3000/jobs?title=Developer&company-name=Tech
```

## Status endpoint

| Modul | Method dan route |
|---|---|
| Users | POST /users, GET /users/:id |
| Authentication | POST/PUT/DELETE /authentications |
| Companies | GET/POST /companies, GET/PUT/DELETE /companies/:id |
| Categories | GET/POST /categories, GET/PUT/DELETE /categories/:id |
| Jobs | GET/POST /jobs, GET /jobs/company/:companyId, GET /jobs/category/:categoryId, GET/PUT/DELETE /jobs/:id |
| Applications | GET/POST /applications, GET/PUT/DELETE /applications/:id, GET /applications/user/:userId, GET /applications/job/:jobId |
| Bookmarks | GET /bookmarks, POST/DELETE /jobs/:jobId/bookmark, GET /jobs/:jobId/bookmark/:id |
| Profile | GET /profile, GET /profile/applications, GET /profile/bookmarks |

## Scripts

- `npm run start:dev`: jalankan HTTP server dengan nodemon
- `npm start`: jalankan HTTP server dengan node
- `npm run migrate:up`: jalankan migration yang belum diterapkan
- `npm run migrate:down`: rollback satu migration terakhir (menghapus tabel pada proyek baru; **data akan hilang**)
- `npm run migrate -- create nama-migration`: buat migration baru (timestamp otomatis dari node-pg-migrate)
- `npm run check`: pemeriksaan sintaks Node.js dan keberadaan file migration, **bukan pengujian API ke database**

## Struktur

```text
openjob-api/
├── migrations/
├── scripts/
├── src/
│   ├── app.js
│   ├── auth.js
│   ├── config.js
│   ├── db.js
│   ├── errors.js
│   ├── server.js
│   └── validation.js
├── docs/ERD-OpenJob-versi-1.dot
├── ERD-OpenJob-versi-1.png
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Catatan pemeriksaan

Kode sudah menjalani pemeriksaan sintaks statis Node.js. Karena runtime pembuatan artefak tidak menyediakan PostgreSQL atau akses instalasi npm dari registry, **migration dan tes Postman belum dijalankan secara langsung**. Hasil lulus 100% tidak diklaim sebelum diuji pada mesin Anda. Tidak ada `node_modules`, kredensial `.env`, atau lockfile palsu dalam arsip.
