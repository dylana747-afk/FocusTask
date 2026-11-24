const request = require("supertest");
const app = require("../app");

describe("FocusTask API", () => {
    test("GET /health renvoie 503 sans BDD", async () => {
        const res = await request(app).get("/health");
        expect(res.status).toBe(503);
    });

    test("POST /api/auth/register refuse les champs manquants", async () => {
        const res = await request(app).post("/api/auth/register").send({});
        expect(res.status).toBe(400);
    });

    test("GET /api/tasks refuse sans token", async () => {
        const res = await request(app).get("/api/tasks");
        expect(res.status).toBe(401);
    });

    test("GET /metrics expose les métriques Prometheus", async () => {
        const res = await request(app).get("/metrics");
        expect(res.text).toContain("http_request_duration_seconds");
    });
});
