const { pool } = require('../dbHandler');

const createTables = async () => {
  await pool.query(
    'CREATE TABLE teams (id SERIAL PRIMARY KEY, name VARCHAR(50));'
  );
  await pool.query(
    'CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(50), hash TEXT, salt TEXT, team_id INT REFERENCES teams(id));'
  );
  await pool.query(
    'CREATE TABLE taxonomies (id SERIAL PRIMARY KEY, name VARCHAR(50), team_id INT REFERENCES teams(id));'
  );
  await pool.query(
    'CREATE TABLE datasets (id SERIAL PRIMARY KEY, name VARCHAR(50), taxonomy_id INT REFERENCES taxonomies(id) ON DELETE CASCADE ON UPDATE CASCADE);'
  );
  await pool.query(
    'CREATE TABLE categories (id SERIAL PRIMARY KEY, name TEXT, taxonomy_id INT REFERENCES taxonomies(id) ON DELETE CASCADE ON UPDATE CASCADE);'
  );
  await pool.query(
    'CREATE TABLE observations (id SERIAL PRIMARY KEY, text TEXT, category_id INT REFERENCES categories(id) ON UPDATE CASCADE, dataset_id INT REFERENCES datasets(id) ON DELETE CASCADE ON UPDATE CASCADE);'
  );
  await pool.query(
    'CREATE TABLE taxonomy_assignments (id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE, taxonomy_id INT REFERENCES taxonomies(id) ON DELETE CASCADE ON UPDATE CASCADE);'
  );
  await pool.query(
    'CREATE TABLE dataset_assignments (id SERIAL PRIMARY KEY, user_id INT REFERENCES users(ID) ON DELETE CASCADE ON UPDATE CASCADE, dataset_id INT REFERENCES datasets(ID) ON DELETE CASCADE ON UPDATE CASCADE, completed BOOLEAN);'
  );
  await pool.query(
    'CREATE TABLE category_assignments (id SERIAL PRIMARY KEY, dataset_assignment_id INT REFERENCES dataset_assignments(id) ON DELETE CASCADE ON UPDATE CASCADE, observation_id INT REFERENCES observations(id) ON DELETE CASCADE ON UPDATE CASCADE, category_id INT REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE);'
  );
};

createTables();

module.exports = createTables;
