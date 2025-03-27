import request from "supertest";
import App from "../app";
import configuration from "../config/config";

describe("App API Tests", () => {
    let appInstance: App;
    let server: any;

    beforeAll(() => {
        appInstance = new App(configuration);
        appInstance.setup();
        server = appInstance.getExpressApp();
    });

    afterAll(() => {
        appInstance.closeServer();
    });

    it("should return 200 OK for /health", async () => {
        const res = await request(server).get("/health");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "Working Fine!" });
    });
});
