const { pool } = require('../dbHandler');

// GET /user/:userId/data
// get user's assigned datasets by taxonomy
exports.getData = async (req, res, next) => {
  const { userId, taxonomyId } = req.params;

  try {
    const { rows: datasets } = await pool.query(
      'SELECT dataset_assignments.id, dataset_assignments.user_id, dataset_assignments.dataset_id, dataset_assignments.completed, datasets.name as dataset_name, datasets.taxonomy_id, taxonomies.name as taxonomy_name FROM dataset_assignments JOIN datasets ON dataset_assignments.dataset_id = datasets.id JOIN taxonomies ON datasets.taxonomy_id = taxonomies.id WHERE user_id = $1 AND taxonomies.id = $2',
      [userId, taxonomyId]
    );

    return res.status(200).json(datasets);
  } catch (error) {
    return res.end(`${error}`);
  }
};

// POST /user/:userId/data
// assign dataset to user
exports.assignData = async (req, res, next) => {
  const { userId } = req.params;

  try {
    await pool.query('DELETE FROM dataset_assignments WHERE dataset_id = $1', [
      req.body.dataId
    ]);
    await pool.query(
      'INSERT INTO dataset_assignments (user_id, dataset_id, completed) VALUES ($1, $2, FALSE)',
      [userId, req.body.dataId]
    );

    return res.status(200).end('Data assigned successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
};

// GET /user/:userId/taxonomy
// get user's assigned taxonomies
exports.getTaxonomies = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const { rows: taxonomies } = await pool.query(
      'SELECT * FROM taxonomy_assignments JOIN taxonomies ON taxonomy_assignments.taxonomy_id = taxonomies.id WHERE user_id = $1',
      [userId]
    );
    return res.status(200).end(JSON.stringify(taxonomies));
  } catch (error) {
    return res.end(`${error}`);
  }
};

// POST /user/:userId/taxonomy
// assign taxonomy to user
exports.assignTaxonomy = async (req, res, next) => {
  const { userId } = req.params;

  try {
    await pool.query(
      'DELETE FROM taxonomy_assignments WHERE taxonomy_id = $1',
      [req.body.taxonomyId]
    );
    await pool.query(
      'INSERT INTO taxonomy_assignments (user_id, taxonomy_id) VALUES ($1, $2)',
      [userId, req.body.taxonomyId]
    );

    return res.status(200).end('Taxonomy assigned successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
};

// GET /user
// find user by email
exports.findUser = async (req, res, next) => {
  const { query } = req.query;

  try {
    const { rows: userFound } = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND team_id IS NULL',
      [query]
    );

    if (userFound.length === 0) {
      return res.status(200).end();
    }

    return res.status(200).end(JSON.stringify(userFound));
  } catch (error) {
    return res.end(`${error}`);
  }
};

// POST /user/team
// assign users to team
exports.assignTeam = async (req, res, next) => {
  try {
    req.body.users.forEach(async (user) => {
      await pool.query('UPDATE users SET team_id = $1 WHERE id = $2', [
        req.body.team,
        user.id
      ]);
      return res.status(200).end();
    });
  } catch (error) {
    return res.end(`${error}`);
  }
};

// DELETE /user/:userId/team
// remove user from team
exports.removeTeam = async (req, res, next) => {
  const { userId } = req.params;

  try {
    await pool.query('UPDATE users SET team_id = NULL WHERE id = $1', [userId]);
    return res.status(200).end();
  } catch (error) {
    return res.end(`${error}`);
  }
};
