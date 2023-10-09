/** @module router */
/** Create API router */

const multer = require('multer');
const passport = require('./services/passport');
const taxonomyController = require('./controllers/taxonomy');
const dataController = require('./controllers/data');
const observationController = require('./controllers/observation');
const authenticationController = require('./controllers/authentication');
const userController = require('./controllers/user');
const teamController = require('./controllers/team');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app) => {
  // taxonomy routes
  app.post(
    '/api/taxonomy',
    upload.single('file'),
    taxonomyController.addTaxonomy
  );
  app.delete('/api/taxonomy/:taxonomyId', taxonomyController.deleteTaxonomy);
  app.get(
    '/api/taxonomy/:taxonomyId/categories',
    taxonomyController.getCategories
  );
  app.get('/api/taxonomy/:taxonomyId/data', taxonomyController.getData);
  app.get('/api/taxonomy', taxonomyController.getTaxonomies);

  // data routes
  app.post('/api/data', upload.single('file'), dataController.addData);
  app.delete('/api/data/:dataId', dataController.deleteData);
  app.get('/api/data/:dataId/observations', dataController.getObservations);

  // observation routes
  app.post(
    '/api/:observationId/category',
    observationController.assignCategory
  );
  app.delete(
    '/api/:observationId/category',
    observationController.deleteCategory
  );

  // authentication routes
  app.post('/auth/signup', authenticationController.signup);
  app.post('/auth/signin', requireSignin, authenticationController.signin);

  // user routes
  app.get('/api/user/:userId/data', requireAuth, userController.getData);
  app.post('/api/user/:userId/data', requireAuth, userController.assignData);
  app.get(
    '/api/user/:userId/taxonomy',
    requireAuth,
    userController.getTaxonomies
  );
  app.post(
    '/api/user/:userId/taxonomy',
    requireAuth,
    userController.assignTaxonomy
  );

  // team routes
  app.get('/api/team/:teamId/user', requireAuth, teamController.getUsers);
};
