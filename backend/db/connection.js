const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "psql123",
  database: "keycloak-setup",
});

client.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Connected to the DB");
  }
});

module.exports = client
