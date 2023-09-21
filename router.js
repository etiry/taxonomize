/** @module router */
/** Create API router */

const multer = require('multer');
const passport = require('./services/passport');
const taxonomyController = require('./controllers/taxonomy');
const dataController = require('./controllers/data');
const observationController = require('./controllers/observation');
const authenticationController = require('./controllers/authentication');
const userController = require('./controllers/user');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app) => {
  // taxonomy routes
  app.post('/taxonomy', upload.single('file'), taxonomyController.addTaxonomy);
  app.delete('/taxonomy/:taxonomyId', taxonomyController.deleteTaxonomy);
  app.get('/taxonomy/:taxonomyId/categories', taxonomyController.getCategories);
  app.get('/taxonomy/:taxonomyId/data', taxonomyController.getData);

  // data routes
  app.post('/data', upload.single('file'), dataController.addData);
  app.delete('/data/:dataId', dataController.deleteData);
  app.get('/data/:dataId/observations', dataController.getObservations);

  // observation routes
  app.post('/:observationId/category', observationController.assignCategory);
  app.delete('/:observationId/category', observationController.deleteCategory);

  // authentication routes
  app.post('/signup', authenticationController.signup);
  app.post('/signin', requireSignin, authenticationController.signin);

  // user routes
  app.get('/user/:userId/data', requireAuth, userController.getData);
  app.post('/user/:userId/data', requireAuth, userController.assignData);
};
