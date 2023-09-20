const User = require('../models/user');
const Data = require('../models/data');

// GET /user/:userId/data
// get user's assigned datasets
exports.getData = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const { assignedData } = await User.findOne({ _id: userId });
    res.writeHead(200);
    return res.end(JSON.stringify(assignedData));
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
