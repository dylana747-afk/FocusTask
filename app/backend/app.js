const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const promBundle = require("express-prom-bundle");
const pinoHttp = require("pino-http");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

app.use(promBundle({ includeMethod: true, includePath: true, autoregister: true }));
app.use(pinoHttp({ autoLogging: { ignore: (req) => ["/health", "/metrics"].includes(req.url) } }));
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    const ok = mongoose.connection.readyState === 1;
    res.status(ok ? 200 : 503).json({ status: ok ? "ok" : "db_down" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/categories", categoryRoutes);

module.exports = app;
