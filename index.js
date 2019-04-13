const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcrypt");
const session = require("express-session");

const server = express();
const dbHelper = require("./data/helpers");
const port = process.env.port || 3000;

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session);

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

//this is custom middleware
function restrictedAccess(req, res, next) {
  //grab sn and pass from headers
  const { username, password } = req.headers;

  // use code from login since it checks if password and username (req.headers) are right

  dbHelper
    .findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        //instead of sending an api message, call next(), since this is middleware
        next();
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
}

server.get("/api/users", restrictedAccess, (req, res) => {
  dbHelper
    .find()
    .then(users => {
      res.json(users);
    })
    .catch(error => res.send(error));
});

server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
