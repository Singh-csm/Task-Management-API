const taskModel = require("../models/taskModel");
const userModel = require("../models/userModel");

const checkRole = async function (req, res, next) {
    try {
        const { userName } = req.body;
        const userDetails = await userModel.findOne({userName: userName});
        if (userDetails.role !== "admin") return res.status(401).send({status: false, message: "You are not authorized to perform this action. Only admin can perform this action"});
        next();
    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    };
};