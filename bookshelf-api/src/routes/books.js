const express = require("express");

const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
} = require("../handlers/booksHandler");

const router = express.Router();

// Menambahkan buku
router.post("/", addBookHandler);

// Menampilkan seluruh buku
router.get("/", getAllBooksHandler);

// Menampilkan detail buku berdasarkan ID
router.get("/:bookId", getBookByIdHandler);

// Memperbarui buku berdasarkan ID
router.put("/:bookId", updateBookByIdHandler);

// Menghapus buku berdasarkan ID
router.delete("/:bookId", deleteBookByIdHandler);

module.exports = router;