const mysql = require("mysql2");
require("dotenv").config();


const pool = mysql.createPool({
    connectionLimit: 300, //important
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    debug: false
});

module.exports = pool;