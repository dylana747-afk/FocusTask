const mongoose = require("mongoose");

// Reconnexion automatique si MongoDB n'est pas encore prêt
module.exports = async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(JSON.stringify({ level: 30, msg: "MongoDB connectée" }));
    } catch (err) {
        console.error(JSON.stringify({ level: 50, msg: "MongoDB injoignable, retry 5s", err: err.message }));
        setTimeout(connectDB, 5000);
    }
};
