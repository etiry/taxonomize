/** @module router */
/** Create API router */

const multer = require('multer');
const taxonomyController = require('./controllers/taxonomy');
const dataController = require('./controllers/data');
const observationController = require('./controllers/observation');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /signup
// sign up

// POST /login
// log in

// GET /user/:userId/data
// get user's assigned datasets

// POST /user/:userId/data
// assign dataset to user

module.exports = (app) => {
  // taxonomy
  app.post('/taxonomy', upload.single('file'), taxonomyController.addTaxonomy);
  app.delete('/taxonomy/:taxonomyId', taxonomyController.deleteTaxonomy);
  app.get('/taxonomy/:taxonomyId/categories', taxonomyController.getCategories);
  app.get('/taxonomy/:taxonomyId/data', taxonomyController.getData);

  // data
  app.post('/data', upload.single('file'), dataController.addData);
  app.delete('/data/:dataId', dataController.deleteData);
  app.get('/data/:dataId/observations', dataController.getObservations);

  // observation
  app.post('/:observationId/category', observationController.assignCategory);
  app.delete('/:observationId/category', observationController.deleteCategory);
};
