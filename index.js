const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");

const dbHelper = require("./data/helpers");
const port = process.env.port || 3000;

const server = express();

//sessions and cookies step 3
const sessionConfig = {
  name: "monkey",
  secret: "keep it secret, keep it safe!",
  cookie: {
    maxAge: 1000 * 60 * 15, //age of the cookie itself, 15 min (1000ms * 60s * #of min)
    secure: false //used over https only, set to false for demo
  },
  httpOnly: true, //can the user access the cookie from js using document.cookie? true = no access, false = can access; you usually want it to be set to true
  resave: false, //do I want to always resave the session, even if there were no changes? Set to false to keep things from getting overly busy.
  saveUninitialized: false //if there is no cookie, do I make a new one and send it? It is illegal to set cookies automatically in some places, so you want it set to false.
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig)); //step 2

server.post("/api/register", (req, res) => {
  let newUser = req.body;
  console.log(newUser, "log 1");

  const hash = bcrypt.hashSync(newUser.password, 11);
  newUser.password = hash;

  dbHelper
    .add(newUser)
    .then(savedUser => {
      res.status(201).json(savedUser);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

//this is custom middleware
function restrictedAccess(req, res, next) {
  //last step for sessions
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "You shall not pass!" });
  }
}

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  dbHelper
    .findBy({ username })
    .first()
    .then(user => {
      //check if passwords match
      if (user && bcrypt.compareSync(password, user.password)) {
        //step 4 for sessions
        req.session.username = user.username;
        res
          .status(200)
          .json({ message: `Welcome ${user.username}, have a cookie!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// restrict access without sessions/cookies
// //this is custom middleware
// function restrictedAccess(req, res, next) {
//   //grab sn and pass from headers
//   const { username, password } = req.headers;
// if (username && password){
//   dbHelper
//     .findBy({ username })
//     .first()
//     .then(user => {
//       if (user && bcrypt.compareSync(password, user.password)) {
//         //instead of sending an api message, call next(), since this is middleware
//         next();
//       } else {
//         res.status(401).json({ message: "Invalid Credentials" });
//       }
//     })
//     .catch(error => {
//       res.status(500).json(error);
//     });
// } else {
//   res.status(400).json({message: 'No // credentials provided'})
// }
// }

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
