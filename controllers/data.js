const { pool } = require('../dbHandler');

// POST /data
// create new dataset via csv upload and save to db
exports.addData = async (req, res, next) => {
  let rows;
  if (req.file) {
    const { buffer } = req.file;
    rows = [...new Set(buffer.toString().split('\n'))].slice(1);
  }

  if (req.body.new === 'true') {
    const dataset = await pool.query(
      'INSERT INTO datasets (name, taxonomy_id) VALUES ($1, $2) RETURNING id',
      [req.body.name, req.body.taxonomyId]
    );

    rows.forEach(async (row) => {
      await pool.query(
        'INSERT INTO observations (text, category_id, dataset_id) VALUES ($1, NULL, $2)',
        [row, dataset.rows[0].id]
      );
    });

    res.status(200).end(JSON.stringify(dataset.rows[0].id));
  } else {
    await pool.query('UPDATE datasets SET name = $1 WHERE id = $2;', [
      req.body.name,
      req.body.dataId
    ]);

    if (req.file) {
      await pool.query('DELETE FROM observations WHERE dataset_id = $1', [
        req.body.dataId
      ]);
      rows.forEach(async (row) => {
        await pool.query(
          'INSERT INTO observations (text, dataset_id) VALUES ($1, $2)',
          [row, req.body.dataId]
        );
      });
    }

    res.status(200).end(JSON.stringify(req.body.dataId));
  }
};

// DELETE /data/:dataId
// delete dataset
exports.deleteData = async (req, res, next) => {
  const { dataId } = req.params;

  try {
    await pool.query('DELETE FROM datasets WHERE id = $1', [dataId]);

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
  const userIds = req.query.userIds.split(',');
  const { dataId } = req.params;

  let queryStringTotals =
    'SELECT COUNT(*) as total_records, CEIL(COUNT(*) / $1) AS total_pages FROM observations JOIN dataset_assignments ON dataset_assignments.dataset_id = observations.dataset_id LEFT JOIN category_assignments ON category_assignments.dataset_assignment_id = dataset_assignments.id AND category_assignments.observation_id = observations.id LEFT JOIN categories ON category_assignments.category_id = categories.id WHERE observations.dataset_id = $2 AND user_id = $3 AND LOWER(text) LIKE LOWER($4)';
  const stringInterpolationsTotals = [
    perPage,
    dataId,
    userIds[0],
    `%${query}%`
  ];

  let queryStringNodes =
    'SELECT observations.id, observations.text, category_assignments.category_id, categories.name FROM observations JOIN dataset_assignments ON dataset_assignments.dataset_id = observations.dataset_id LEFT JOIN category_assignments ON category_assignments.dataset_assignment_id = dataset_assignments.id AND category_assignments.observation_id = observations.id LEFT JOIN categories ON category_assignments.category_id = categories.id WHERE observations.dataset_id = $1 AND user_id = $2 AND LOWER(observations.text) LIKE LOWER($3)';
  const stringInterpolationsNodes = [
    dataId,
    userIds[0],
    `%${query}%`,
    perPage,
    perPage * page - perPage
  ];

  let queryStringLimitOffset = ' LIMIT $4 OFFSET $5';

  if (filter) {
    queryStringTotals += ' AND category_assignments.category_id = $5';
    stringInterpolationsTotals.push(filter);

    console.log(stringInterpolationsTotals);

    queryStringNodes += ' AND category_assignments.category_id = $4';
    stringInterpolationsNodes.splice(3, 0, filter);
    queryStringLimitOffset = ' LIMIT $5 OFFSET $6';

    console.log(stringInterpolationsNodes);
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

// GET /data/:dataId/user
// get users assigned to given dataset
exports.getDataUsers = async (req, res, next) => {
  const { dataId } = req.params;

  try {
    const { rows: users } = await pool.query(
      'SELECT users.id, users.email, users.name, dataset_assignments.dataset_id FROM users JOIN dataset_assignments ON users.id = dataset_assignments.user_id WHERE dataset_assignments.dataset_id = $1',
      [dataId]
    );

    return res.status(200).json(users);
  } catch (error) {
    return res.end(`${error}`);
  }
};

// POST /data/:datasetAssignment
// mark dataset assignment complete or incomplete
exports.markDataComplete = async (req, res, next) => {
  const { datasetAssignmentId } = req.params;

  try {
    await pool.query(
      'UPDATE dataset_assignments SET completed = $1 WHERE id = $2',
      [req.body.value, datasetAssignmentId]
    );

    return res.status(200).end();
  } catch (error) {
    return res.end(`${error}`);
  }
};
