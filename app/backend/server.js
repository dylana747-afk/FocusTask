require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(JSON.stringify({ level: 30, msg: `Server running on port ${PORT}` })));

connectDB();

// Arrêt propre (zero-downtime lors des rolling updates)
process.on("SIGTERM", () => {
    server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
    });
});
