const Task = require("../models/Task");

/* GET */
exports.getTasks = async (req, res) => {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
};

/* CREATE */
exports.createTask = async (req, res) => {

    const task = new Task({
        userId: req.user.id,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        priority: req.body.priority || "medium",
        deadline: req.body.deadline,
        status: "à faire"
    });

    await task.save();
    res.json(task);
};

/* UPDATE STATUS */
exports.updateTask = async (req, res) => {

    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { status: req.body.status },
        { new: true }
    );

    res.json(task);
};

/* DELETE */
exports.deleteTask = async (req, res) => {
    await Task.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.json({ ok: true });
};