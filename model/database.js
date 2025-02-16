require("dotenv").config();
const mysql = require("mysql");

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

const con = mysql.createConnection({
  host: DB_HOST || "127.0.0.1",
  user: DB_USER || "root",
  password: DB_PASS,
  database: DB_NAME || "routes_db", 
  multipleStatements: true
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  
  let sql = `
    DROP TABLE IF EXISTS routes;
    CREATE TABLE routes (
      id INT NOT NULL AUTO_INCREMENT,
      start_point VARCHAR(255) NOT NULL,
      end_point VARCHAR(255) NOT NULL,
      distance DECIMAL(10, 2),
      duration DECIMAL(10, 2), 
      route_type VARCHAR(50), 
      PRIMARY KEY (id)
    );
  `;

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table creation `routes` was successful!");

    console.log("Closing...");
  });

  con.end();
});