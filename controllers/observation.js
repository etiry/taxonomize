const { pool } = require('../dbHandler');

// POST /:observationId/category
// assign category to observation
exports.assignCategory = async (req, res, next) => {
  const { observationId } = req.params;

  try {
    await pool.query('UPDATE observations SET category_id = $1 WHERE id = $2', [
      parseInt(req.body.categoryId),
      parseInt(observationId)
    ]);

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
      'UPDATE observations SET category_id = NULL WHERE id = $1',
      [parseInt(observationId)]
    );

    return res.status(200).end('Category deleted successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
};
