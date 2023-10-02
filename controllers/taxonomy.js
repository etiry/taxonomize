const { pool } = require('../dbHandler');

// POST /taxonomy
// create new taxonomy via csv upload and save to db
exports.addTaxonomy = async (req, res, next) => {
  const { buffer } = req.file;
  const rows = buffer.toString().split('\r\n');

  const taxonomy = await pool.query(
    'INSERT INTO taxonomies (name, team_id) VALUES ($1, $2) RETURNING id',
    [req.body.name, parseInt(req.body.teamId)]
  );

  rows.forEach(async (row) => {
    await pool.query(
      'INSERT INTO categories (name, taxonomy_id) VALUES ($1, $2)',
      [row, taxonomy.rows[0].id]
    );
  });

  res.status(200).end();
};

// DELETE /taxonomy/:taxonomyId
// delete taxonomy
exports.deleteTaxonomy = async (req, res, next) => {
  const { taxonomyId } = req.params;

  try {
    await pool.query('DELETE FROM taxonomies WHERE id = $1', [
      parseInt(taxonomyId)
    ]);

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
      'SELECT id, name FROM categories WHERE taxonomy_id = $1',
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
