const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) res.status(404).send('Error: username was not provided');
  if (!password) res.status(404).send('Error: password was not provided');

  if (!authenticatedUser(username, password)) {
    res.status(404).send('Invalid login: Check username and password');
  }

  let accessToken = jwt.sign({
    data: password
  }, "fingerprint_customer", { expiresIn: 60 * 60 });

  req.session.authorization = {
    accessToken, username
  };

  res.status(200).send('User has successfully logged in');
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.query.review;

  if (!review) res.status(400).send('Error: a review was submitted as part of the request');

  books[isbn].reviews[username] = review;

  res.status(200).send(`Successfully submitted a review from '${username}'`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
