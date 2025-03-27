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
        appInstance.setup(true);
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
    it("should give error when URL is not provided", async () => {
        const response = await request(server)
            .post("/api/url/shorten")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("URL is required");
    });
    it("should redirect to the original URL", async () => {
        const shortenResponse = await request(server)
            .post("/api/url/shorten")
            .send({ longUrl: "https://example.com" });

        const shortId = shortenResponse.body.shortUrl.split("/").pop();

        const redirectResponse = await request(server).get(`/api/url/${shortId}`);

        expect(redirectResponse.status).toBe(302);
    });
    it("should give error for invalid short url", async () => {
        const shortenResponse = await request(server)
            .post("/api/url/shorten")
            .send({ longUrl: "https://example.com" });

        // const shortId = shortenResponse.body.shortUrl.split("/").pop();

        const redirectResponse = await request(server).get(`/api/url/random`);

        expect(redirectResponse.status).toBe(404);
        expect(redirectResponse.body).toHaveProperty("error");
        expect(redirectResponse.body.error).toBe("Short URL not found");
    });
});
