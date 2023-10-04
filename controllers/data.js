const { pool } = require('../dbHandler');

// POST /data
// create new dataset via csv upload and save to db
exports.addData = async (req, res, next) => {
  const { buffer } = req.file;
  const rows = [...new Set(buffer.toString().split('\n'))].slice(1);

  const dataset = await pool.query(
    'INSERT INTO datasets (name, taxonomy_id) VALUES ($1, $2) RETURNING id',
    [req.body.name, parseInt(req.body.taxonomyId)]
  );

  rows.forEach(async (row) => {
    await pool.query(
      'INSERT INTO observations (text, category_id, dataset_id) VALUES ($1, NULL, $2)',
      [row, dataset.rows[0].id]
    );
  });

  res.status(200).end();
};

// DELETE /data/:dataId
// delete dataset
exports.deleteData = async (req, res, next) => {
  const { dataId } = req.params;

  try {
    await pool.query('DELETE FROM datasets WHERE id = $1', [parseInt(dataId)]);

    return res.status(200).end('Dataset deleted successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
};

// GET /data/:dataId/observations
// get all observations for a given dataset
exports.getObservations = async (req, res, next) => {
  const perPage = 10;
  const page = req.query.page || 1;
  const { dataId } = req.params;

  try {
    const totals = await pool.query(
      'SELECT COUNT(*) as total_records, CEIL(COUNT(*) / $1) AS total_pages FROM observations WHERE dataset_id = $2',
      [perPage, parseInt(dataId)]
    );
    const { rows: nodes } = await pool.query(
      'SELECT observations.id, observations.text, category_assignments.category_id FROM observations LEFT JOIN category_assignments ON category_assignments.observation_id = observations.id WHERE dataset_id = $1 LIMIT $2 OFFSET $3',
      [parseInt(dataId), perPage, perPage * page - perPage]
    );

    return res.status(200).end(
      JSON.stringify({
        pageInfo: {
          total: totals.rows[0].total_records,
          totalPages: totals.rows[0].total,
          startSize: perPage * page - perPage + 1,
          endSize: perPage * page
        },
        nodes
      })
    );
  } catch (error) {
    return res.end(`${error}`);
  }
};
