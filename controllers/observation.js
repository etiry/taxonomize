const { pool } = require('../dbHandler');

// POST /observation/:observationId/category
// assign final category to observation
exports.assignFinalCategory = async (req, res, next) => {
  const { observationId } = req.params;

  try {
    await pool.query('UPDATE observations SET category_id = $1 WHERE id = $3', [
      req.body.categoryId,
      observationId
    ]);

    return res.status(200).end();
  } catch (error) {
    return res.end(`${error}`);
  }
};
