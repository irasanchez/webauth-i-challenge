const knex = require("knex");
const dbConfig = require("./../knexfile");
const db = knex(dbConfig.development);

module.exports = {
  addUser: async function(user) {
    const query = await db("users").insert(user);

    return findUserByID(query);
  },
  // findUsers: function() {
  //   return db("users").select("id", "username", "password");
  // },
  findUserByID: function(id) {
    return db("users")
      .where("id", id)
      .first();
  }
};
