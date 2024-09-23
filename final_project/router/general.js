const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) res.status(400).send('Error: no username provided for the new user');
  if (!password) res.status(400).send('Error: no password provided for the new user');

  if (users.some(user => user.username === username)) {
    res.status(400).send('Error: user was the same username already exists');
  }

  users.push({ username, password });

  res.status(200).send(`Successfully registered the user '${username}'`);
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (isbn in books) {
    res.status(200).send(JSON.stringify(books[isbn], null, 4));
  }

  res.status(404).send(`Error: could not find book with ISBN ${isbn}`);
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const selectedBooks = [];

  for (let i = 1; i <= 10; i++) {
    if (books[i].author === author) selectedBooks.push(books[i]);
  }

  if (selectedBooks.length === 0) {
    res.status(404).send(`Error: no books were found written by the author ${author}`);
  }

  res.status(200).send(JSON.stringify(selectedBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const selectedBooks = [];

  for (let i = 1; i <= 10; i++) {
    if (books[i].title === title) selectedBooks.push(books[i]);
  }

  if (selectedBooks.length === 0) {
    res.status(404).send(`Error: no books were found with the title ${title}`);
  }

  res.status(200).send(JSON.stringify(selectedBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (isbn in books) {
    res.status(200).send(JSON.stringify(books[isbn]['reviews'], null, 4));
  }

  res.status(404).send(`Error: unable to find book with ISBN ${isbn}`);
});

module.exports.general = public_users;
