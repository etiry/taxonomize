const { pool } = require('../dbHandler');

// POST /taxonomy
// create new taxonomy via csv upload and save to db
exports.addTaxonomy = async (req, res, next) => {
  let rows;
  if (req.file) {
    const { buffer } = req.file;
    rows = buffer.toString().split('\r\n');
  }

  if (req.body.new === 'true') {
    const taxonomy = await pool.query(
      'INSERT INTO taxonomies (name, team_id) VALUES ($1, $2) RETURNING id',
      [req.body.name, req.body.teamId]
    );

    rows.forEach(async (row) => {
      await pool.query(
        'INSERT INTO categories (name, taxonomy_id) VALUES ($1, $2)',
        [row, taxonomy.rows[0].id]
      );
    });

    res.status(200).end(JSON.stringify(taxonomy.rows[0].id));
  } else {
    await pool.query('UPDATE taxonomies SET name = $1 WHERE id = $2;', [
      req.body.name,
      req.body.taxonomyId
    ]);

    if (req.file) {
      await pool.query('DELETE FROM categories WHERE taxonomy_id = $1', [
        req.body.taxonomyId
      ]);
      rows.forEach(async (row) => {
        await pool.query(
          'INSERT INTO categories (name, taxonomy_id) VALUES ($1, $2)',
          [row, req.body.taxonomyId]
        );
      });
    }

    res.status(200).end(JSON.stringify(req.body.taxonomyId));
  }
};

// DELETE /taxonomy/:taxonomyId
// delete taxonomy
exports.deleteTaxonomy = async (req, res, next) => {
  const { taxonomyId } = req.params;

  try {
    await pool.query('DELETE FROM taxonomies WHERE id = $1', [taxonomyId]);

    return res.status(200).end('Taxonomy deleted successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
};

// GET /taxonomy/:taxonomyId/categories
// get all categories for a given taxonomy
exports.getCategories = async (req, res, next) => {
  const { taxonomyId } = req.params;

  try {
    const { rows: categories } = await pool.query(
      'SELECT id, name FROM categories WHERE taxonomy_id = $1 ORDER BY name',
      [parseInt(taxonomyId)]
    );
    return res.status(200).end(JSON.stringify(categories));
  } catch (error) {
    return res.end(`${error}`);
  }
};

// GET /taxonomy/:taxonomyId/data
// get all datasets for a given taxonomy
exports.getData = async (req, res, next) => {
  const { taxonomyId } = req.params;

  try {
    const { rows: datasets } = await pool.query(
      'SELECT id, name FROM datasets WHERE taxonomy_id = $1',
      [parseInt(taxonomyId)]
    );
    return res.status(200).end(JSON.stringify(datasets));
  } catch (error) {
    return res.end(`${error}`);
  }
};

// GET /taxonomy
// get all taxonomies
exports.getTaxonomies = async (req, res, next) => {
  try {
    const { rows: taxonomies } = await pool.query('SELECT * FROM taxonomies');
    return res.status(200).end(JSON.stringify(taxonomies));
  } catch (error) {
    return res.end(`${error}`);
  }
};

// GET /taxonomy/:taxonomyId/user
// get users assigned to given taxonomy
exports.getTaxonomyUsers = async (req, res, next) => {
  const { taxonomyId } = req.params;

  try {
    const { rows: users } = await pool.query(
      'SELECT users.id, users.email, users.name, taxonomy_assignments.taxonomy_id FROM users JOIN taxonomy_assignments ON users.id = taxonomy_assignments.user_id WHERE taxonomy_assignments.taxonomy_id = $1',
      [taxonomyId]
    );

    return res.status(200).json(users);
  } catch (error) {
    return res.end(`${error}`);
  }
};
