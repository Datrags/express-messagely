/** Database connection for messagely. */

process.env.PGPASSWORD = "new_pass";

const { Client } = require("pg");
const { DB_URI } = require("./config");

const client = new Client(DB_URI);

client.connect();


module.exports = client;
