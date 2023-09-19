const Data = require('../models/data');
const Observation = require('../models/observation');
const Taxonomy = require('../models/taxonomy');

// POST /data
// create new dataset via csv upload and save to db
exports.addData = async (req, res, next) => {
  const { buffer } = req.file;
  const rows = [...new Set(buffer.toString().split('\n'))].slice(1);
  const taxonomy = await Taxonomy.findOne({ _id: req.body.taxonomy });

  const data = new Data();
  data.name = req.body.name;
  data.taxonomy = taxonomy;
  data.observations = [];
  data.completed = false;

  rows.forEach((row) => {
    const observation = new Observation();
    observation.text = row;
    observation.category = null;
    observation.save();
    data.observations.push(observation);
  });

  data.save();

  taxonomy.data.push(data);
  taxonomy.save();

  res.end();
};

// DELETE /data/:dataId
// delete dataset
exports.deleteData = async (req, res, next) => {
  const { dataId } = req.params;

  try {
    await Data.deleteOne({ _id: dataId });

    res.writeHead(200);
    return res.end('Dataset deleted successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
};

// GET /data/:dataId/observations
// get all observations for a given dataset
exports.getObservations = async (req, res, next) => {
  const { dataId } = req.params;

  try {
    const { observations } = await Data.findOne({ _id: dataId }).populate(
      'observations'
    );
    res.writeHead(200);
    return res.end(JSON.stringify(observations));
  } catch (error) {
    return res.end(`${error}`);
  }
};
