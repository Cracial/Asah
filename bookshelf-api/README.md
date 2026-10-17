# Bookshelf API

Bookshelf API adalah REST API untuk mengelola data buku menggunakan
Node.js dan Express.

## Teknologi

- Node.js
- Express
- Nano ID
- ESLint

## Instalasi

Pastikan Node.js dan npm telah terpasang.

```bash
npm install
```

## Menjalankan aplikasi

```bash
npm run start
```

Server berjalan pada:

http://localhost:9000

## Endpoint

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | /books | Menambahkan buku |
| GET | /books | Menampilkan seluruh buku |
| GET | /books/:bookId | Menampilkan detail buku |
| PUT | /books/:bookId | Memperbarui buku |
| DELETE | /books/:bookId | Menghapus buku |

## Filter opsional

- GET /books?name=dicoding
- GET /books?reading=1
- GET /books?finished=1

## Pemeriksaan kode

```bash
npm run lint
```

## Penyimpanan data

Data buku disimpan dalam array di memori aplikasi.
Data tidak bertahan setelah server dimatikan.