const {
  addBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
} = require("../services/booksService");

// Menambahkan buku
const addBookHandler = (req, res) => {
  const { name, readPage, pageCount } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
  }

  const bookId = addBook(req.body);

  return res.status(201).json({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId,
    },
  });
};

// Menampilkan seluruh buku
const getAllBooksHandler = (req, res) => {
  const books = getAllBooks(req.query);

  return res.status(200).json({
    status: "success",
    data: {
      books,
    },
  });
};

// Menampilkan detail buku berdasarkan ID
const getBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const book = getBookById(bookId);

  if (!book) {
    return res.status(404).json({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
};

// Memperbarui buku berdasarkan ID
const updateBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const { name, readPage, pageCount } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
  }

  const isUpdated = updateBookById(bookId, req.body);

  if (!isUpdated) {
    return res.status(404).json({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
};

// Menghapus buku berdasarkan ID
const deleteBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const isDeleted = deleteBookById(bookId);

  if (!isDeleted) {
    return res.status(404).json({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Buku berhasil dihapus",
  });
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};