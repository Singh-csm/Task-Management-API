const taskModel = require("../models/taskModel");
const userModel = require("../models/userModel");

const createTask = async function (req, res) {
    try {
        const data = req.body;
        const { title, description, userName } = data;
        const userDetails = await userModel.findOne({ userName: userName });
        if (!title) return res.status(400).send({ status: false, messagae: "title is required to create a task. Please provide title to create a task" });
        if (!description) return res.status(400).send({ status: false, messagae: "Description is required to create a task. Please provide description to create a task" });
        if (userDetails.role !== "admin") return res.status(401).send({ status: false, messagae: "Pov! You are not authorized to create a new task. Only admin can create new task" });
        const taskDetails = await taskModel.findOne({ title: title });
        if (taskDetails) {
            if (isDeleted === false) return res.status(409).send({ status: false, messagae: "Task with this title has already been created. Please choose another title to create a new task" });
            const taskCreated = await taskModel.findOneAndUpdate({ title: title }, { isDeleted: false }, { new: true });
            return res.status(201).send({ status: true, messagae: "Task created successfully", data: taskCreated });
        };
        const taskCreated = await taskModel.findOneAndUpdate({ title: title }, { isDeleted: false }, { new: true });
        return res.status(201).send({ status: true, messagae: "Task created successfully", data: taskCreated });
    } catch (error) {
        res.status(500).send({status: false, messagae: error.messagae});
    };
};

module.exports = {createTask};