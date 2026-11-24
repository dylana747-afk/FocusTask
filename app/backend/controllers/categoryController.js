const Category = require("../models/Category");

/* GET */
exports.getCategories = async (req, res) => {
    const cats = await Category.find({ userId: req.user.id });
    res.json(cats);
};

/* CREATE */
exports.createCategory = async (req, res) => {

    const cat = new Category({
        userId: req.user.id,
        name: req.body.name
    });

    await cat.save();
    res.json(cat);
};

/* DELETE */
exports.deleteCategory = async (req, res) => {

    await Category.deleteOne({
        _id: req.params.id,
        userId: req.user.id
    });

    res.json({ ok: true });
};