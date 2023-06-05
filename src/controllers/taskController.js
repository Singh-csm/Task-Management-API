const taskModel = require("../models/taskModel");
const userModel = require("../models/userModel");

const createTask = async function (req, res) {
    try {
        const data = req.body;
        const { title, description, userName } = data;
        if (!title) return res.status(400).send({ status: false, messagae: "title is required to create a task. Please provide title to create a task" });
        if (!description) return res.status(400).send({ status: false, messagae: "Description is required to create a task. Please provide description to create a task" });
        const taskDetails = await taskModel.findOne({ title: title });
        if (taskDetails) {
            if (isDeleted === false) return res.status(409).send({ status: false, messagae: "Task with this title has already been created. Please choose another title to create a new task" });
            const taskCreated = await taskModel.findOneAndUpdate({ title: title }, { isDeleted: false }, { new: true });
            return res.status(201).send({ status: true, messagae: "Task created successfully", data: taskCreated });
        };
        const taskCreated = await taskModel.findOneAndUpdate({ title: title }, { isDeleted: false }, { new: true });
        return res.status(201).send({ status: true, messagae: "Task created successfully", data: taskCreated });
    } catch (error) {
        res.status(500).send({ status: false, messagae: error.messagae });
    };
};

const viewAllTasks = async function (req, res) {
    try {
        const {currentPage} = req.params.page;
        const allTasks = await taskModel.find({isDeleted: false}).skip(currentPage * 10).limit(10);
        if (allTasks.length === 0) return res.status(404).send({status: false, messagae: "No more tasks found. You have viewed all tasks"});
        res.status(200).send({status: true, data: allTasks});
    } catch (error) {
        res.status(500).send({ status: false, messagae: error.messagae });
    };
};

module.exports = { createTask };