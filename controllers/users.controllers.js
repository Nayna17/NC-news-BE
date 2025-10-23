const { fetchUsers } = require("../models/users.models");

exports.getUsers = (req, res) => {
  return fetchUsers().then((users) => {
    res.status(200).send(users);
  });
};
