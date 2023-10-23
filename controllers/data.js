const Cohen = require('cohens-kappa');
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
  const { dataId } = req.params;
  const userIds = req.query.userIds.split(',');

  if (userIds.length === 1) {
    userIds.push(null);
  }

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

  if (filter) {
    queryStringTotals += ' AND user1_category_id = $6';
    stringInterpolationsTotals.push(filter);

    queryStringNodes += ' AND user1_category_id = $5';
    stringInterpolationsNodes.splice(4, 0, filter);
    queryStringLimitOffset = ' LIMIT $6 OFFSET $7';
  }

  if (sort) {
    const sortParams = sort.split('_');
    if (sortParams[1] === 'Asc') {
      sortParams[0] === 'text'
        ? (queryStringNodes += ' ORDER BY text')
        : (queryStringNodes += ' ORDER BY user1_category_name');
    } else {
      sortParams[0] === 'text'
        ? (queryStringNodes += ' ORDER BY text DESC')
        : (queryStringNodes += ' ORDER BY user1_category_name DESC');
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
    const { rows: agreementObs } = await pool.query(
      queryStringNodes,
      stringInterpolationsNodes.slice(0, -2)
    );

    const reformatAgreementData = (data, user) =>
      data.reduce((acc, ob) => {
        const { id } = ob;
        const userCategory = ob[`user${user}_category_id`];

        if (!userCategory) {
          return { ...acc };
        }

        return { ...acc, [id]: userCategory };
      }, {});

    const user1Data = reformatAgreementData(agreementObs, 1);
    const user2Data = reformatAgreementData(agreementObs, 2);

    const calculatePercentAgreement = (data1, data2) => {
      let numAgreements;
      let total;

      const getNumOfAgreements = (ref, comp) => {
        const agreements = Object.keys(ref).reduce((acc, key) => {
          if (ref[key] === comp[key]) {
            acc += 1;
          }
          return acc;
        }, 0);

        return [agreements, Object.keys(ref).length];
      };

      if (Object.keys(data1).length <= Object.keys(data2).length) {
        [numAgreements, total] = getNumOfAgreements(data1, data2);
      } else {
        [numAgreements, total] = getNumOfAgreements(data2, data1);
      }

      return Math.round((numAgreements / total) * 100) / 100;
    };

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
          cohensKappa
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
