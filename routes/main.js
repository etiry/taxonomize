/** @module router */
/** Create API router */

const router = require('express').Router();
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Category = require('../models/category');
const Taxonomy = require('../models/taxonomy');
const Observation = require('../models/observation');
const Data = require('../models/data');
const User = require('../models/user');

// POST /taxonomy
// create new taxonomy via csv upload and save to db
router.post('/taxonomy', upload.single('file'), async (req, res, next) => {
  const { buffer } = req.file;
  const rows = buffer.toString().split('\r\n');

  const taxonomy = new Taxonomy();
  taxonomy.name = 'BJS Offenses';
  taxonomy.categories = [];

  rows.forEach((row) => {
    const category = new Category();
    category.name = row;
    category.save()
    taxonomy.categories.push(category);
  })

  taxonomy.save();
  res.end();
});

// POST /data
// create new dataset via csv upload and save to db
router.post('/data', upload.single('file'), async (req, res, next) => {
  const { buffer } = req.file;
  const rows = [...new Set(buffer.toString().split('\n'))].slice(1);

  console.log(rows);

  const data = new Data();
  data.observations = [];
  data.completed = false;

  rows.forEach((row) => {
    const observation = new Observation();
    observation.text = row;
    observation.category = null;
    observation.save()
    data.observations.push(observation);
  })

  data.save();
  res.end();
});

module.exports = router;
