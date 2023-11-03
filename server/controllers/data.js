const Cohen = require('cohens-kappa');
const { pool } = require('../dbHandler');
const {
  reformatAgreementData,
  calculatePercentAgreement
} = require('../util/agreementStatistics.js');

// POST /data
// create new dataset via csv upload and save to db
exports.addData = async (req, res, next) => {
  let rows;
  if (req.file) {
    const { buffer } = req.file;
    rows = [...new Set(buffer.toString().split('\n'))].slice(1);
    rows = rows.map((row) => row.replaceAll('"', ''));
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
  const filter = req.query.filter.split(',');
  const different = req.query.different || '';
  const { dataId } = req.params || null;
  const userIds = req.query.userIds.split(',');

  userIds.map((id) => (id === 'null' ? null : id));

  if (userIds.length === 1) {
    userIds.push(null);
  }

  if (dataId && userIds[0]) {
    let queryStringTotals = `WITH user1category AS (
        SELECT observation_id, category_id as user1_category_id, name as user1_category_name 
        FROM dataset_assignments AS da 
        JOIN category_assignments AS ca
        ON da.id = ca.dataset_assignment_id
        JOIN categories as c
        ON ca.category_id = c.id 
        WHERE da.dataset_id = $1 AND user_id = $2
      ), user2category AS (
        SELECT observation_id, category_id as user2_category_id, name as user2_category_name 
        FROM dataset_assignments AS da 
        JOIN category_assignments AS ca
        ON da.id = ca.dataset_assignment_id
        JOIN categories as c
        ON ca.category_id = c.id 
        WHERE da.dataset_id = $1 AND user_id = $3
      )
      SELECT  COUNT(*) as total_records, CEIL(COUNT(*) / $4) AS total_pages 
      FROM observations AS o
      LEFT JOIN user1category AS uc1
      ON o.id = uc1.observation_id
      LEFT JOIN user2category AS uc2
      USING (observation_id)
      WHERE LOWER(text) LIKE LOWER($5)`;
    const stringInterpolationsTotals = [
      dataId,
      userIds[0],
      userIds[1],
      perPage,
      `%${query}%`
    ];

    let queryStringNodes = `WITH user1category AS (
        SELECT observation_id, category_id as user1_category_id, name as user1_category_name 
        FROM dataset_assignments AS da 
        JOIN category_assignments AS ca
        ON da.id = ca.dataset_assignment_id
        JOIN categories as c
        ON ca.category_id = c.id 
        WHERE da.dataset_id = $1 AND user_id = $2
      ), user2category AS (
        SELECT observation_id, category_id as user2_category_id, name as user2_category_name 
        FROM dataset_assignments AS da 
        JOIN category_assignments AS ca
        ON da.id = ca.dataset_assignment_id
        JOIN categories as c
        ON ca.category_id = c.id 
        WHERE da.dataset_id = $1 AND user_id = $3
      )
      SELECT id, text, category_id, dataset_id, user1_category_id, user1_category_name, user2_category_id, user2_category_name 
      FROM observations AS o
      LEFT JOIN user1category AS uc1
      ON o.id = uc1.observation_id
      LEFT JOIN user2category AS uc2
      USING (observation_id)
      WHERE LOWER(text) LIKE LOWER($4)`;
    const stringInterpolationsNodes = [
      dataId,
      userIds[0],
      userIds[1],
      `%${query}%`,
      perPage,
      perPage * page - perPage
    ];

    let queryStringLimitOffset = ' LIMIT $5 OFFSET $6';

    if (filter[0] && filter[1]) {
      queryStringTotals +=
        ' AND user1_category_id = $6 AND user2_category_id = $7';
      stringInterpolationsTotals.push(filter[0], filter[1]);

      queryStringNodes +=
        ' AND user1_category_id = $5 AND user2_category_id = $6';
      stringInterpolationsNodes.splice(4, 0, filter);
      queryStringLimitOffset = ' LIMIT $7 OFFSET $8';
    }

    if (filter[0]) {
      queryStringTotals += ' AND user1_category_id = $6';
      stringInterpolationsTotals.push(filter[0]);

      queryStringNodes += ' AND user1_category_id = $5';
      stringInterpolationsNodes.splice(4, 0, filter[0]);
      queryStringLimitOffset = ' LIMIT $6 OFFSET $7';
    }

    if (filter[1]) {
      queryStringTotals += ' AND user2_category_id = $6';
      stringInterpolationsTotals.push(filter[1]);

      queryStringNodes += ' AND user2_category_id = $5';
      stringInterpolationsNodes.splice(4, 0, filter[1]);
      queryStringLimitOffset = ' LIMIT $6 OFFSET $7';
    }

    if (different) {
      queryStringTotals +=
        ' AND user1_category_id IS DISTINCT FROM user2_category_id';
      queryStringNodes +=
        ' AND user1_category_id IS DISTINCT FROM user2_category_id';
    }

    if (sort) {
      const sortParams = sort.split('_');
      if (sortParams[1] === 'Asc') {
        if (sortParams[0] === 'text') {
          queryStringNodes += ' ORDER BY text';
        } else if (sortParams[0] === 'category1') {
          queryStringNodes += ' ORDER BY user1_category_name';
        } else {
          queryStringNodes += ' ORDER BY user2_category_name';
        }
      } else if (sortParams[1] === 'Desc') {
        if (sortParams[0] === 'text') {
          queryStringNodes += ' ORDER BY text DESC';
        } else if (sortParams[0] === 'category1') {
          queryStringNodes += ' ORDER BY user1_category_name DESC';
        } else {
          queryStringNodes += ' ORDER BY user2_category_name DESC';
        }
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
      const { rows: allObs } = await pool.query(
        queryStringNodes,
        stringInterpolationsNodes.slice(0, -2)
      );

      const user1Data = reformatAgreementData(allObs, 1);
      const user2Data = reformatAgreementData(allObs, 2);

      const cohensKappa = Cohen.kappa(user1Data, user2Data, 81, 'none');

      const percentAgreement = calculatePercentAgreement(user1Data, user2Data);

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
          agreement: {
            percentAgreement,
            cohensKappa: cohensKappa.message ? null : cohensKappa
          },
          nodes,
          allObs
        })
      );
    } catch (error) {
      console.log(error);
      return res.end(`${error}`);
    }
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
