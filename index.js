const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const bcrypt = require("bcrypt");

const server = express();

server.use(helmet());
server.use(express.json());

const port = process.env.port || 3000;

server.post("/api/register", (req, res) => {
  //Creates a `user`
  // from req.body
  // **Hash the password**
  // save to database
  console.log(req.body);
});

server.post("/api/login", (req, res) => {
  // Use the credentials sent inside the `body` to authenticate the user.
  // - On successful login, create a new session for the user
  // - and send back a 'Logged in' message
  // - and a cookie that contains the user id.
  // - If login fails,
  // - respond with the correct status code
  // - and the message: 'You shall not pass!'
});

server.get("/api/users", (req, res) => {
  // - If the user is logged in,
  // - respond with an array of all the users contained in the database.
  // If the user is not logged in
  // - respond with the correct status code
  // - and the message: 'You shall not pass!'.
});

server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
