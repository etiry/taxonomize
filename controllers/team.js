const { pool } = require('../dbHandler');

// GET /team/:teamId/user
// get users on a team
exports.getUsers = async (req, res, next) => {
  const { teamId } = req.params;

  try {
    const { rows: users } = await pool.query(
      'SELECT users.id, users.email, users.name, users.team_id, teams.name as team_name FROM users JOIN teams ON users.team_id = teams.id WHERE teams.id = $1',
      [teamId]
    );

    console.log(users);

    return res.status(200).json(users);
  } catch (error) {
    return res.end(`${error}`);
  }
};
