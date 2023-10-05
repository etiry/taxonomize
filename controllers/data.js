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
  const query = req.query.query || '';
  const sort = req.query.sort || '';
  const filter = req.query.filter || '';
  const { dataId } = req.params;

  try {
    const totals = await pool.query(
      'SELECT COUNT(*) as total_records, CEIL(COUNT(*) / $1) AS total_pages FROM observations WHERE dataset_id = $2 AND LOWER(text) LIKE LOWER($3)',
      [perPage, parseInt(dataId), `%${query}%`]
    );
    const { rows: nodes } = await pool.query(
      'SELECT observations.id, observations.text, category_assignments.category_id, categories.name as category_name FROM observations LEFT JOIN category_assignments ON category_assignments.observation_id = observations.id LEFT JOIN categories ON category_assignments.category_id = categories.id WHERE dataset_id = $1 AND LOWER(observations.text) LIKE LOWER($2) LIMIT $3 OFFSET $4',
      [parseInt(dataId), `%${query}%`, perPage, perPage * page - perPage]
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
    console.log(error);
    return res.end(`${error}`);
  }
};
