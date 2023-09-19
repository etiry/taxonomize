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
router.post('/taxonomy', upload.single('file'), (req, res, next) => {
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
router.post('/data', upload.single('file'), (req, res, next) => {
  const { buffer } = req.file;
  const rows = [...new Set(buffer.toString().split('\n'))].slice(1);

  const data = new Data();
  data.taxonomy = null;
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

// POST /:observationId/category
// assign category to observation
router.post('/:observationId/category', async (req, res, next) => {
  const { observationId } = req.params;

  try {
    const category = await Category.findOne({ _id: req.body.category });

    await Observation.findOneAndUpdate(
      { _id: observationId },
      { 'category': category },
      { new: true }
    );

    res.writeHead(200);
    return res.end('Category updated successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
})

// DELETE /:observationId/category
// delete category from observation
router.delete('/:observationId/category', async (req, res, next) => {
  const { observationId } = req.params;

  try {
    await Observation.findOneAndUpdate(
      { _id: observationId },
      { 'category': null },
      { new: true }
    );

    res.writeHead(200);
    return res.end('Category deleted successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
})

// DELETE /taxonomy/:taxonomyId
// delete taxonomy
router.delete('/taxonomy/:taxonomyId', async (req, res, next) => {
  const { taxonomyId } = req.params;

  try {
    await Taxonomy.deleteOne({ _id: taxonomyId });

    res.writeHead(200);
    return res.end('Taxonomy deleted successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
})

// DELETE /data/:dataId
// delete dataset
router.delete('/data/:dataId', async (req, res, next) => {
  const { dataId } = req.params;

  try {
    await Data.deleteOne({ _id: dataId });

    res.writeHead(200);
    return res.end('Dataset deleted successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
})

// GET /taxonomy/:taxonomyId/categories
// get all categories for a given taxonomy
router.get('/taxonomy/:taxonomyId/categories', async (req, res, next) => {
  const { taxonomyId } = req.params;

  try {
    const { categories } = await Taxonomy.findOne({ _id: taxonomyId }).populate({
      path: 'categories'
    });
    res.writeHead(200);
    return res.end(JSON.stringify(categories));
  } catch (error) {
    return res.end(`${error}`);
  }
})

// GET /taxonomy/:taxonomyId/data
// get all datasets for a given taxonomy

// GET /data/:dataId/observations
// get all observations for a given dataset

// POST /login
// log in

// GET /user/:userId/data
// get user's assigned datasets

// POST /user/:userId/data
// assign dataset to user

module.exports = router;
