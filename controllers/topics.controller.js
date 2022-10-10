const topicsModel = require("../models/topics.model.js");

exports.getTopics = (req, res) => {
    return topicsModel.selectTopics().then((topics) => {
        return res.status(200).send({topics})
    })
}