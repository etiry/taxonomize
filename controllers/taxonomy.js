const Category = require('../models/category');
const Taxonomy = require('../models/taxonomy');

// POST /taxonomy
// create new taxonomy via csv upload and save to db
exports.addTaxonomy = (req, res, next) => {
  const { buffer } = req.file;
  const rows = buffer.toString().split('\r\n');

  const taxonomy = new Taxonomy();
  taxonomy.name = req.body.name;
  taxonomy.categories = [];

  rows.forEach((row) => {
    const category = new Category();
    category.name = row;
    category.save();
    taxonomy.categories.push(category);
  });

  taxonomy.save();
  res.end();
};

// DELETE /taxonomy/:taxonomyId
// delete taxonomy
exports.deleteTaxonomy = async (req, res, next) => {
  const { taxonomyId } = req.params;

  try {
    await Taxonomy.deleteOne({ _id: taxonomyId });

    res.writeHead(200);
    return res.end('Taxonomy deleted successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
};

// GET /taxonomy/:taxonomyId/categories
// get all categories for a given taxonomy
exports.getCategories = async (req, res, next) => {
  const { taxonomyId } = req.params;

  try {
    const { categories } = await Taxonomy.findOne({ _id: taxonomyId }).populate(
      'categories'
    );
    res.writeHead(200);
    return res.end(JSON.stringify(categories));
  } catch (error) {
    return res.end(`${error}`);
  }
};

// GET /taxonomy/:taxonomyId/data
// get all datasets for a given taxonomy
exports.getData = async (req, res, next) => {
  const { taxonomyId } = req.params;

  try {
    const { data } = await Taxonomy.findOne({ _id: taxonomyId }).populate(
      'data',
      'name'
    );
    res.writeHead(200);
    return res.end(JSON.stringify(data));
  } catch (error) {
    return res.end(`${error}`);
  }
};

// GET /taxonomy
// get all taxonomies
exports.getTaxonomies = async (req, res, next) => {
  try {
    const taxonomies = await Taxonomy.find({});
    res.writeHead(200);
    return res.end(JSON.stringify(taxonomies));
  } catch (error) {
    return res.end(`${error}`);
  }
};
