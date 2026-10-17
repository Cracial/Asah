const express = require("express");
const booksRoute = require("./routes/books");

const app = express();
const PORT = 9000;

// Middleware untuk membaca request body JSON
app.use(express.json());

// Route utama Bookshelf API
app.use("/books", booksRoute);

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Bookshelf API berjalan pada http://localhost:${PORT}`);
});