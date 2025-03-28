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

    // it("should call process.exit(0) when NODE_ENV is not 'test'", async () => {
    //     const spyExit = jest.spyOn(process, "exit").mockImplementation(() => {
    //         return undefined as never;
    //         // throw new Error("process.exit called"); // Prevent Jest from exiting
    //     });

    //     process.env.NODE_ENV = "production"; // Simulate production environment
    //     console.log(process.env.NODE_ENV);
    //     appInstance.startServer();
    //     appInstance.closeServer();
    //     // expect(() => appInstance.closeServer()).toThrow("process.exit called");
    //     expect(spyExit).toHaveBeenCalledWith(0); // Ensure process.exit(0) was called

    //     spyExit.mockRestore(); // Restore original process.exit
    // });

    it("should NOT call process.exit(0) when NODE_ENV is 'test'", async () => {
        const spyExit = jest.spyOn(process, "exit").mockImplementation(() => { return undefined as never; });

        process.env.NODE_ENV = "test"; // Simulate test environment

        appInstance.closeServer();

        expect(spyExit).not.toHaveBeenCalled(); // process.exit(0) should NOT be called

        spyExit.mockRestore(); // Restore process.exit
    });
    it("server should work fine when redis is not mocked", async () => {
        let appInstance2 = new App(configuration);
        appInstance2.setup();
        const res = await request(server).get("/health");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "Working Fine!" });
    });
});
