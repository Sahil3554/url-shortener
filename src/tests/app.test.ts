import request from "supertest";
import App from "../app";
import configuration from "../config/config";

describe("App API Tests", () => {
    let appInstance: App;
    let server: any;

    beforeAll(() => {
        process.env.NODE_ENV = "test"; // Set environment to test
        appInstance = new App(configuration);
        appInstance.setup(true);
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

    it("should start the server successfully", (done) => {
        const spy = jest.spyOn(console, "log").mockImplementation();
        appInstance.startServer();

        setTimeout(() => {
            expect(spy).toHaveBeenCalledWith(
                expect.stringContaining("🚀 Server running on port")
            );
            spy.mockRestore();
            done();
        }, 500);
    });

    it("should close the server successfully", (done) => {
        const spyLog = jest.spyOn(console, "log").mockImplementation();
        const spyRedisDisconnect = jest.spyOn(appInstance.getRedisConnector(), "disconnect").mockImplementation();

        appInstance.closeServer();

        setTimeout(() => {
            expect(spyLog).toHaveBeenCalledWith("🛑 Server closed successfully.");
            expect(spyRedisDisconnect).toHaveBeenCalledTimes(1);

            spyLog.mockRestore();
            spyRedisDisconnect.mockRestore();
            done();
        }, 500);
    });
});
