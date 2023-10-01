const User = require('../models/user');
const Data = require('../models/data');
const Taxonomy = require('../models/taxonomy');
const { pool } = require('../dbHandler');

// GET /user/:userId/data
// get user's assigned datasets
exports.getData = async (req, res, next) => {
  const { userId } = req.params;

  try {
    pool.query(
      'SELECT * FROM dataset_assignments WHERE user_id = $1',
      [userId],
      (results) => {
        res.status(200).json(results.rows);
      }
    );
  } catch (error) {
    return res.end(`${error}`);
  }
};

// POST /user/:userId/data
// assign dataset to user
exports.assignData = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const data = await Data.findOne({ _id: req.body.data });

    const { assignedData } = await User.findOne({ _id: userId });
    assignedData.push(data);

    await User.findOneAndUpdate(
      { _id: userId },
      { assignedData },
      { new: true }
    );

    res.writeHead(200);
    return res.end('Data assigned successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
};

// GET /user/:userId/taxonomy
// get user's assigned taxonomies
exports.getTaxonomies = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const { assignedTaxonomies } = await User.findOne({ _id: userId }).populate(
      'assignedTaxonomies'
    );
    res.writeHead(200);
    return res.end(JSON.stringify(assignedTaxonomies));
  } catch (error) {
    return res.end(`${error}`);
  }
};

// POST /user/:userId/taxonomy
// assign taxonomy to user
exports.assignTaxonomy = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const taxonomy = await Taxonomy.findOne({ _id: req.body.taxonomy });

    const { assignedTaxonomies } = await User.findOne({ _id: userId });
    assignedTaxonomies.push(taxonomy);

    await User.findOneAndUpdate(
      { _id: userId },
      { assignedTaxonomies },
      { new: true }
    );

    res.writeHead(200);
    return res.end('Taxonomy assigned successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
};
