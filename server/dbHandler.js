const { Pool } = require('pg');
const keys = require('./config/keys');

// connect to DB
const pool = new Pool({
  connectionString: keys.DATABASE_URL
});

module.exports = { pool };
