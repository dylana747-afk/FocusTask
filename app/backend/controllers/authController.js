const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Champs manquants" });
    }

    const exists = await User.findOne({ email });

    if (exists) {
        return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hash = await bcrypt.hash(password, 10);

    await new User({ username, email, password: hash }).save();

    res.status(201).json({ message: "OK" });
};

exports.login = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "Erreur login" });

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) return res.status(401).json({ message: "Erreur login" });

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({ token, username: user.username });
};