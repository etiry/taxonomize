const { pool } = require('../dbHandler');

// POST /:observationId/category
// assign category to observation
exports.assignCategory = async (req, res, next) => {
  const { observationId } = req.params;

  try {
    const { rows: exists } = await pool.query(
      'SELECT * FROM category_assignments WHERE dataset_assignment_id = $1 AND observation_id = $2',
      [req.body.datasetAssignmentId, observationId]
    );

    if (exists.length === 0) {
      await pool.query(
        'INSERT INTO category_assignments (dataset_assignment_id, observation_id, category_id) VALUES ($1, $2, $3)',
        [req.body.datasetAssignmentId, observationId, req.body.categoryId]
      );
    } else {
      await pool.query(
        'UPDATE category_assignments SET category_id = $1 WHERE dataset_assignment_id = $2 AND observation_id = $3',
        [req.body.categoryId, req.body.datasetAssignmentId, observationId]
      );
    }

    return res.status(200).end();
  } catch (error) {
    return res.end(`${error}`);
  }
};

// DELETE /:observationId/category
// delete category from observation
exports.deleteCategory = async (req, res, next) => {
  const { observationId } = req.params;

  try {
    await pool.query(
      'UPDATE category_assignments SET category_id = NULL WHERE id = $1',
      [parseInt(observationId)]
    );

    return res.status(200).end('Category deleted successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
};
