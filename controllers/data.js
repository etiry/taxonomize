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

  let queryStringTotals =
    'SELECT COUNT(*) as total_records, CEIL(COUNT(*) / $1) AS total_pages FROM observations LEFT JOIN category_assignments ON category_assignments.observation_id = observations.id WHERE dataset_id = $2 AND LOWER(text) LIKE LOWER($3)';
  const stringInterpolationsTotals = [perPage, parseInt(dataId), `%${query}%`];

  let queryStringNodes =
    'SELECT observations.id, observations.text, category_assignments.category_id, categories.name as category_name FROM observations LEFT JOIN category_assignments ON category_assignments.observation_id = observations.id LEFT JOIN categories ON category_assignments.category_id = categories.id WHERE dataset_id = $1 AND LOWER(observations.text) LIKE LOWER($2)';
  const stringInterpolationsNodes = [
    dataId,
    `%${query}%`,
    perPage,
    perPage * page - perPage
  ];

  let queryStringLimitOffset = ' LIMIT $3 OFFSET $4';

  if (filter) {
    queryStringTotals += ' AND category_assignments.category_id = $4';
    stringInterpolationsTotals.push(filter);

    queryStringNodes += ' AND category_assignments.category_id = $3';
    stringInterpolationsNodes.splice(2, 0, filter);
    queryStringLimitOffset = ' LIMIT $4 OFFSET $5';
  }

  if (sort) {
    const sortParams = sort.split('_');
    if (sortParams[1] === 'Asc') {
      sortParams[0] === 'text'
        ? (queryStringNodes += ' ORDER BY observations.text')
        : (queryStringNodes += ' ORDER BY categories.name');
    } else {
      sortParams[0] === 'text'
        ? (queryStringNodes += ' ORDER BY observations.text DESC')
        : (queryStringNodes += ' ORDER BY categories.name DESC');
    }
  }

  try {
    const totals = await pool.query(
      queryStringTotals,
      stringInterpolationsTotals
    );
    const { rows: nodes } = await pool.query(
      queryStringNodes + queryStringLimitOffset,
      stringInterpolationsNodes
    );

    return res.status(200).end(
      JSON.stringify({
        pageInfo: {
          total: totals.rows[0].total_records,
          totalPages: totals.rows[0].total,
          startSize: perPage * page - perPage + 1,
          endSize:
            totals.rows[0].total_records >= perPage
              ? perPage * page
              : totals.rows[0].total_records
        },
        nodes
      })
    );
  } catch (error) {
    console.log(error);
    return res.end(`${error}`);
  }
};
