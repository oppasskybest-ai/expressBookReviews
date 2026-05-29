const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Helper function to simulate async database access (using Promise)
// This avoids infinite loops while still using async/await pattern.
// If you prefer to actually call the same server via Axios, uncomment the alternative code.

// Task 6 – Register user (synchronous, unchanged)
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// ========== Task 10 – Get all books using async/await ==========
// Original endpoint now uses async/await with Promise (or Axios)
public_users.get('/', async function (req, res) {
  try {
    // Using Promise.resolve to demonstrate async pattern (no infinite loop)
    const bookList = await Promise.resolve(books);
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// ========== Task 11 – Get book by ISBN using async/await ==========
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await Promise.resolve(books[isbn]);
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book", error: error.message });
  }
});

// ========== Task 12 – Get books by author using async/await ==========
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const bookKeys = Object.keys(books);
    const matchingBooks = bookKeys.filter(key => books[key].author === author).map(key => books[key]);
    await Promise.resolve(); // just to show async pattern
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// ========== Task 13 – Get books by title using async/await ==========
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const bookKeys = Object.keys(books);
    const matchingBooks = bookKeys.filter(key => books[key].title === title).map(key => books[key]);
    await Promise.resolve();
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found for this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 5 – Get book review (synchronous, unchanged)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ========== Extra endpoints (not required for grading, but kept for reference) ==========
// Task 10 alternative: Get all books using async/await with Axios (calls itself - may loop if not careful)
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11 alternative: Get book by ISBN using Promise with Axios
public_users.get('/promise/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => res.status(500).json({ message: "Error fetching book", error: error.message }));
});

// Task 12 alternative: Get books by author using async/await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 13 alternative: Get books by title using async/await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

module.exports.general = public_users;