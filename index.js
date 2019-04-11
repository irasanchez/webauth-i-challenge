const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcrypt");

const server = express();
const dbHelper = require("./data/helpers");
const port = process.env.port || 3000;

server.use(helmet());
server.use(express.json());

server.post("/api/register", (req, res) => {
  let newUser = req.body;

  const hash = bcrypt.hashSync(newUser.password, 11);
  newUser.password = hash;

  try {
    dbHelper
      .addUser(newUser)
      .then(savedUser => res.status(201).json(savedUser));
  } catch (error) {
    res.status(500).json({ error });
  }
});

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  dbHelper
    .findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// server.get("/api/users", (req, res) => {
//   // - If the user is logged in,
//   // - respond with an array of all the users contained in the database.
//   // If the user is not logged in
//   // - respond with the correct status code
//   // - and the message: 'You shall not pass!'.
// });

server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
