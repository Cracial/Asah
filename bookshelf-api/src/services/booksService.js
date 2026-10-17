const books = require("../data/books");
const { nanoid } = require("nanoid");

const addBook = (bookData) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = bookData;

  const insertedAt = new Date().toISOString();

  const newBook = {
    id: nanoid(),
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    insertedAt,
    updatedAt: insertedAt,
  };

  books.push(newBook);

  return newBook.id;
};

const getAllBooks = (query = {}) => {
  let filteredBooks = [...books];

  const { name, reading, finished } = query;

  if (typeof name === "string" && name.trim() !== "") {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.trim().toLowerCase()),
    );
  }

  if (reading === "0" || reading === "1") {
    const isReading = reading === "1";

    filteredBooks = filteredBooks.filter(
      (book) => book.reading === isReading,
    );
  }

  if (finished === "0" || finished === "1") {
    const isFinished = finished === "1";

    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished,
    );
  }

  return filteredBooks.map(({ id, name: bookName, publisher }) => ({
    id,
    name: bookName,
    publisher,
  }));
};

const getBookById = (bookId) => {
  return books.find((book) => book.id === bookId);
};

const updateBookById = (bookId, bookData) => {
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return false;
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = bookData;

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    updatedAt: new Date().toISOString(),
  };

  return true;
};

const deleteBookById = (bookId) => {
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return false;
  }

  books.splice(bookIndex, 1);

  return true;
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};