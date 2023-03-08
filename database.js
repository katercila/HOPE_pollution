// allows to create a connection pool to database
const mysql = require('mysql2/promise');
const dotenv = require ('dotenv');

dotenv.config();

const pool = mysql.createPool ({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
    // port: 3306

})

module.exports = pool;