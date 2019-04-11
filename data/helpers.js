const knex = require("knex");
const dbConfig = require("./../knexfile");
const db = knex(dbConfig.development);

module.exports = { findUserByID, addUser };

function findUserByID(id) {
  return db("users")
    .where("id", id)
    .first();
}

async function addUser(user) {
  const query = await db("users").insert(user);

  return findUserByID(query);
}
// findUsers: function() {
//   return db("users").select("id", "username", "password");
// },
