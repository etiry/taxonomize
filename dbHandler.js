const { Pool } = require('pg');
const keys = require('./config/keys');

// connect to DB
const pool = new Pool({
  user: keys.POSTGRES_USER,
  host: keys.POSTGRES_HOST,
  database: keys.POSTGRES_DB,
  password: keys.POSTGRES_PASSWORD,
  port: keys.PORT
});

module.exports = { pool };
