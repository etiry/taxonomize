const { pool } = require('../dbHandler');

// GET /team/:teamId/user
// get users on a team
exports.getTeamUsers = async (req, res, next) => {
  const { teamId } = req.params;

  try {
    const { rows: users } = await pool.query(
      'SELECT users.id, users.email, users.name, users.team_id, teams.name as team_name FROM users JOIN teams ON users.team_id = teams.id WHERE teams.id = $1',
      [teamId]
    );

    return res.status(200).json(users);
  } catch (error) {
    return res.end(`${error}`);
  }
};

// POST /team
// create a team or edit
exports.addTeam = async (req, res, next) => {
  if (req.body.new === true) {
    const team = await pool.query(
      'INSERT INTO teams (name) VALUES ($1) RETURNING id',
      [req.body.name]
    );

    res
      .status(200)
      .send(JSON.stringify({ id: team.rows[0].id, name: req.body.name }));
  } else {
    await pool.query('UPDATE teams SET name = $1 WHERE id = $2;', [
      req.body.name,
      req.body.teamId
    ]);

    res
      .status(200)
      .send(JSON.stringify({ id: req.body.teamId, name: req.body.name }));
  }
};
