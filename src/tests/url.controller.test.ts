import request from "supertest";
import App from "../app";
import configuration from "../config/config";

describe("URL Shortener API", () => {
    let appInstance: App;
    let server: any;
    jest.mock("nanoid", () => ({
        nanoid: jest.fn(() => "mockedShortId"),
    }));

    beforeAll(() => {
        appInstance = new App(configuration);
        appInstance.setup();
        server = appInstance.getExpressApp();
    });

    afterAll(() => {
        appInstance.closeServer();
    });
    it("should shorten a URL", async () => {
        const response = await request(server)
            .post("/api/url/shorten")
            .send({ longUrl: "https://example.com" });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("shortUrl");
    });

    it("should redirect to the original URL", async () => {
        const shortenResponse = await request(server)
            .post("/api/url/shorten")
            .send({ longUrl: "https://example.com" });

        const shortId = shortenResponse.body.shortUrl.split("/").pop();

        const redirectResponse = await request(server).get(`/api/url/${shortId}`);

        expect(redirectResponse.status).toBe(302);
    });
});
