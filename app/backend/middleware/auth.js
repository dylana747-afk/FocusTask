const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    const header = req.header("Authorization");

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Pas de token" });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: "Token invalide" });
    }
};