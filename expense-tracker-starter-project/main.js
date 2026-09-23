/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 */

// ========================================================
// DATA TRANSAKSI
// ========================================================

let transactions = [];
let editingTransactionId = null;

const STORAGE_KEY = "expenseTrackerTransactions";


// ========================================================
// HELPER
// ========================================================

function generateId() {
  return +new Date();
}

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount);
}

function saveTransactions() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );
}

function notifyTransactionUpdated() {
  saveTransactions();

  document.dispatchEvent(
    new Event("transaction:updated")
  );
}


// ========================================================
// DOM ELEMENT
// ========================================================

// Form
const transactionForm = document.getElementById("transactionForm");

const transactionFormTitleInput =
  document.getElementById("transactionFormTitleInput");

const transactionFormAmountInput =
  document.getElementById("transactionFormAmountInput");

const transactionFormDateInput =
  document.getElementById("transactionFormDateInput");

const transactionFormTypeSelect =
  document.getElementById("transactionFormTypeSelect");

const transactionFormSubmitButton =
  document.querySelector(
    '[data-testid="transactionFormSubmitButton"]'
  );

// Form heading
const transactionFormHeading =
  document.getElementById("form-heading");

// List
const incomeList =
  document.getElementById("incomeList");

const expenseList =
  document.getElementById("expenseList");

// Search
const searchTransactionForm =
  document.getElementById("searchTransactionForm");

const searchTransactionFormTitleInput =
  document.getElementById(
    "searchTransactionFormTitleInput"
  );

// Dashboard
const balanceElement =
  document.querySelector(
    ".tracker-summary__balance-amount"
  );

const incomeElement =
  document.querySelector(
    ".tracker-summary__stat-amount--income"
  );

const expenseElement =
  document.querySelector(
    ".tracker-summary__stat-amount--expense"
  );


// ========================================================
// LOAD DATA DARI LOCAL STORAGE
// ========================================================

function loadTransactions() {
  const savedTransactions =
    localStorage.getItem(STORAGE_KEY);

  if (!savedTransactions) {
    transactions = [];
    return;
  }

  try {
    const parsedTransactions =
      JSON.parse(savedTransactions);

    if (Array.isArray(parsedTransactions)) {
      transactions = parsedTransactions;
    } else {
      transactions = [];
    }
  } catch (error) {
    console.error(
      "Gagal membaca data transaksi:",
      error
    );

    transactions = [];
  }
}


// ========================================================
// KARTU TRANSAKSI
// ========================================================

function createTransactionCard(transaction) {
  const item = document.createElement("div");

  item.setAttribute(
    "data-testid",
    "transactionItem"
  );

  item.classList.add(
    "tracker-transaction-item"
  );

  // Icon
  const icon = document.createElement("div");

  icon.classList.add(
    "tracker-transaction-item__icon",
    transaction.type === "income"
      ? "tracker-transaction-item__icon--income"
      : "tracker-transaction-item__icon--expense"
  );

  icon.textContent =
    transaction.type === "income"
      ? "↑"
      : "↓";


  // Detail
  const detail = document.createElement("div");

  detail.classList.add(
    "tracker-transaction-item__detail"
  );

  // Judul
  const title = document.createElement("h3");

  title.setAttribute(
    "data-testid",
    "transactionItemTitle"
  );

  title.classList.add(
    "tracker-transaction-item__title"
  );

  title.textContent = transaction.title;


  // Tanggal
  const date = document.createElement("p");

  date.setAttribute(
    "data-testid",
    "transactionItemDate"
  );

  date.classList.add(
    "tracker-transaction-item__date"
  );

  date.textContent =
    `Tanggal: ${transaction.date}`;


  detail.appendChild(title);
  detail.appendChild(date);


  // Bagian kanan
  const right = document.createElement("div");

  right.classList.add(
    "tracker-transaction-item__right"
  );


  // Nominal
  const amount = document.createElement("p");

  amount.setAttribute(
    "data-testid",
    "transactionItemAmount"
  );

  amount.classList.add(
    "tracker-transaction-item__amount",
    transaction.type === "income"
      ? "tracker-transaction-item__amount--income"
      : "tracker-transaction-item__amount--expense"
  );

  amount.textContent =
    `${transaction.type === "income" ? "+" : "-"} ${formatRupiah(transaction.amount)}`;


  // Tipe
  const type = document.createElement("p");

  type.setAttribute(
    "data-testid",
    "transactionItemType"
  );

  type.classList.add(
    "tracker-transaction-item__date"
  );

  type.textContent =
    `Tipe: ${
      transaction.type === "income"
        ? "Pemasukan"
        : "Pengeluaran"
    }`;


  // Tombol
  const actions = document.createElement("div");

  actions.classList.add(
    "tracker-transaction-item__actions"
  );


  // ======================================================
  // BUTTON EDIT
  // ======================================================

  const editButton =
    document.createElement("button");

  editButton.type = "button";

  editButton.textContent = "Edit";

  editButton.classList.add(
    "tracker-transaction-item__btn"
  );

  editButton.setAttribute(
    "data-testid",
    "transactionItemEditButton"
  );

  editButton.addEventListener(
    "click",
    function () {
      startEditTransaction(transaction.id);
    }
  );


  // ======================================================
  // BUTTON UBAH TIPE
  // ======================================================

  const changeTypeButton =
    document.createElement("button");

  changeTypeButton.type = "button";

  changeTypeButton.textContent =
    "Ubah Tipe";

  changeTypeButton.classList.add(
    "tracker-transaction-item__btn"
  );

  changeTypeButton.setAttribute(
    "data-testid",
    "transactionItemEditTypeButton"
  );

  changeTypeButton.addEventListener(
    "click",
    function () {
      changeTransactionType(transaction.id);
    }
  );


  // ======================================================
  // BUTTON HAPUS
  // ======================================================

  const deleteButton =
    document.createElement("button");

  deleteButton.type = "button";

  deleteButton.textContent = "Hapus";

  deleteButton.classList.add(
    "tracker-transaction-item__btn"
  );

  deleteButton.setAttribute(
    "data-testid",
    "transactionItemDeleteButton"
  );

  deleteButton.addEventListener(
    "click",
    function () {
      deleteTransaction(transaction.id);
    }
  );


  actions.appendChild(editButton);
  actions.appendChild(changeTypeButton);
  actions.appendChild(deleteButton);


  right.appendChild(amount);
  right.appendChild(type);
  right.appendChild(actions);


  item.appendChild(icon);
  item.appendChild(detail);
  item.appendChild(right);


  return item;
}


// ========================================================
// RENDER TRANSAKSI
// ========================================================

function renderTransactions() {
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  const keyword =
    searchTransactionFormTitleInput.value
      .trim()
      .toLowerCase();

  const filteredTransactions =
    transactions.filter(function (transaction) {
      return transaction.title
        .toLowerCase()
        .includes(keyword);
    });


  filteredTransactions.forEach(
    function (transaction) {

      const card =
        createTransactionCard(transaction);

      if (transaction.type === "income") {
        incomeList.appendChild(card);
      } else {
        expenseList.appendChild(card);
      }

    }
  );
}


// ========================================================
// UPDATE DASHBOARD
// ========================================================

function updateDashboard() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(
    function (transaction) {

      if (transaction.type === "income") {
        totalIncome += Number(transaction.amount);
      }

      if (transaction.type === "expense") {
        totalExpense += Number(transaction.amount);
      }

    }
  );

  const balance =
    totalIncome - totalExpense;


  balanceElement.textContent =
    formatRupiah(balance);

  incomeElement.textContent =
    formatRupiah(totalIncome);

  expenseElement.textContent =
    formatRupiah(totalExpense);
}


// ========================================================
// RESET FORM
// ========================================================

function resetForm() {
  transactionForm.reset();

  editingTransactionId = null;

  transactionFormHeading.textContent =
    "Tambah Pencatatan Baru";

  transactionFormSubmitButton.textContent =
    "Simpan";

  transactionFormTypeSelect.value =
    "income";
}


// ========================================================
// TAMBAH / EDIT TRANSAKSI
// ========================================================

transactionForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();


    const title =
      transactionFormTitleInput.value.trim();

    const amount =
      Number(transactionFormAmountInput.value);

    const date =
      transactionFormDateInput.value;

    const type =
      transactionFormTypeSelect.value;


    // ====================================================
    // VALIDASI JUDUL
    // ====================================================

    if (title === "") {
      alert("Judul transaksi tidak boleh kosong.");
      transactionFormTitleInput.focus();
      return;
    }


    // ====================================================
    // VALIDASI NOMINAL
    // ====================================================

    if (amount < 1 || !Number.isFinite(amount)) {
      alert("Nominal transaksi harus minimal Rp1.");
      transactionFormAmountInput.focus();
      return;
    }


    // ====================================================
    // MODE EDIT
    // ====================================================

    if (editingTransactionId !== null) {

      const transactionIndex =
        transactions.findIndex(
          function (transaction) {
            return transaction.id === editingTransactionId;
          }
        );


      if (transactionIndex !== -1) {

        transactions[transactionIndex] = {
          ...transactions[transactionIndex],
          title: title,
          amount: amount,
          date: date,
          type: type
        };

      }

      resetForm();

      notifyTransactionUpdated();

      return;
    }


    // ====================================================
    // MODE TAMBAH
    // ====================================================

    const newTransaction = {
      id: generateId(),
      title: title,
      amount: amount,
      date: date,
      type: type
    };


    transactions.push(newTransaction);

    resetForm();

    notifyTransactionUpdated();
  }
);


// ========================================================
// EDIT TRANSAKSI
// ========================================================

function startEditTransaction(id) {

  const transaction =
    transactions.find(
      function (item) {
        return item.id === id;
      }
    );


  if (!transaction) {
    return;
  }


  editingTransactionId = id;


  transactionFormTitleInput.value =
    transaction.title;

  transactionFormAmountInput.value =
    transaction.amount;

  transactionFormDateInput.value =
    transaction.date;

  transactionFormTypeSelect.value =
    transaction.type;


  transactionFormHeading.textContent =
    "Edit Pencatatan";

  transactionFormSubmitButton.textContent =
    "Simpan Perubahan";


  transactionFormTitleInput.focus();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ========================================================
// HAPUS TRANSAKSI
// ========================================================

function deleteTransaction(id) {

  transactions =
    transactions.filter(
      function (transaction) {
        return transaction.id !== id;
      }
    );


  if (editingTransactionId === id) {
    resetForm();
  }


  notifyTransactionUpdated();
}


// ========================================================
// UBAH TIPE TRANSAKSI
// ========================================================

function changeTransactionType(id) {

  const transaction =
    transactions.find(
      function (item) {
        return item.id === id;
      }
    );


  if (!transaction) {
    return;
  }


  transaction.type =
    transaction.type === "income"
      ? "expense"
      : "income";


  notifyTransactionUpdated();
}


// ========================================================
// CUSTOM EVENT
// ========================================================

document.addEventListener(
  "transaction:updated",
  function () {

    renderTransactions();

    updateDashboard();

  }
);


// ========================================================
// PENCARIAN
// ========================================================

searchTransactionFormTitleInput.addEventListener(
  "input",
  function () {

    renderTransactions();

  }
);


// Mencegah form pencarian melakukan reload halaman
searchTransactionForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();

    renderTransactions();

  }
);


// ========================================================
// INITIALIZATION
// ========================================================

loadTransactions();

document.dispatchEvent(
  new Event("transaction:updated")
);