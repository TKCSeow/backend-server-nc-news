const usersModel = require("../models/users.model");

exports.getUsers = (req, res) => {
    return usersModel.selectUsers().then((users) => {
        return res.status(200).send({users});
    })
}