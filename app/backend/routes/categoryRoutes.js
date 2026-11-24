const router = require("express").Router();
const auth = require("../middleware/auth");
const cat = require("../controllers/categoryController");

router.get("/", auth, cat.getCategories);
router.post("/", auth, cat.createCategory);
router.delete("/:id", auth, cat.deleteCategory);

module.exports = router;