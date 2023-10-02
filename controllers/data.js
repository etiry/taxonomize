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
  const { dataId } = req.params;

  try {
    const { rows: observations } = await pool.query(
      'SELECT id, text FROM observations WHERE dataset_id = $1',
      [parseInt(dataId)]
    );
    return res.status(200).end(JSON.stringify(observations));
  } catch (error) {
    return res.end(`${error}`);
  }
};
