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
        const { page } = req.params.page;
        const allTasks = await taskModel.find({ isDeleted: false }).skip((page - 1) * 10).limit(10);
        if (allTasks.length === 0) return res.status(404).send({ status: false, messagae: "No more tasks found. You have viewed all tasks" });
        res.status(200).send({ status: true, data: allTasks });
    } catch (error) {
        res.status(500).send({ status: false, messagae: error.messagae });
    };
};

const completeATask = async function (req, res) {
    try {
        const { userName, title } = req.params;
        const taskDetails = await taskModel.findOne({ user: userName, title: title, isDeleted: false });
        if (taskDetails) return res.status(400).send({ status: false, messagae: "You have already completed this task. Please refresh this page to view updated status" });
        const taskCompleted = await taskModel.findOneAndUpdate({ title: title }, { $push: { user: userName } }, { new: true });
        res.status(200).send({ status: true, messagae: "Congretulation! You have completed this task", data: taskCompleted });
    } catch (error) {
        res.status(500).send({ status: false, messagae: error.messagae });
    };
};

const viewYourCompletedTask = async function (req, res) {
    try {
        const { userName, page } = req.params;
        const completedTask = await taskModel.find({ $in: { user: userName }, isDeleted: false }).skip((page - 1) * 10).limit(10);
        if (completedTask.length === 0) {
            if (page === 1) return res.status(404).send({ status: false, messagae: "You have not completed any task" });
            return res.status(404).send({ status: false, messagae: "No more completed task found" });
        };
        res.status(200).send({ status: true, data: completedTask });
    } catch (error) {
        res.status(500).send({ status: false, messagae: error.messagae });
    };
};

const viewYourPendingTask = async function (req, res) {
    try {
        const { userName } = req.params;
        const pendingTasks = await taskModel.find({ $nin: {user: userName}, isDeleted: false }).skip((page - 1) * 10).limit(10);
        if (pendingTasks.length === 0) {
            if (page === 1) return res.status(404).send({status: false, messagae: "You have completed all tasks."})
            return res.status(404).send({ status: false, messagae: "No more pending task found" });
        };
        res.status(200).send({status: true, data: pendingTasks});
    } catch (error) {
        res.status(500).send({ status: false, messagae: error.messagae });
    };
};

module.exports = { createTask, viewAllTasks, completeATask, viewYourCompletedTask, viewYourPendingTask };