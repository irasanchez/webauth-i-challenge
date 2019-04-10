const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const bcrypt = require("bcrypt");

const server = express();

server.use(helmet());
server.use(express.json());

const port = process.env.port || 4000;

server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
