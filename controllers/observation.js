const Observation = require('../models/observation');
const Category = require('../models/category');

// POST /:observationId/category
// assign category to observation
exports.assignCategory = async (req, res, next) => {
  const { observationId } = req.params;

  try {
    const category = await Category.findOne({ _id: req.body.category });

    await Observation.findOneAndUpdate(
      { _id: observationId },
      { category },
      { new: true }
    );

    res.writeHead(200);
    return res.end('Category updated successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
};

// DELETE /:observationId/category
// delete category from observation
exports.deleteCategory = async (req, res, next) => {
  const { observationId } = req.params;

  try {
    await Observation.findOneAndUpdate(
      { _id: observationId },
      { category: null },
      { new: true }
    );

    res.writeHead(200);
    return res.end('Category deleted successfully');
  } catch (error) {
    return res.end(`${error}`);
  }
};
