// db.js
const { Pool } = require('pg');

// Fill in with your DB credentials
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'eyewear_db',
  password: 'your_password',  // replace with your PostgreSQL password
  port: 5432,
});

module.exports = pool;
