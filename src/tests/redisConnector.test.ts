import RedisConnector from "../redis";
import Config from "../config/config";
import Redis from "ioredis";

jest.mock("ioredis", () => {
    return jest.fn().mockImplementation(() => ({
        on: jest.fn(),
        quit: jest.fn().mockResolvedValue(undefined),
    }));
});

describe("RedisConnector", () => {
    let redisConnector: RedisConnector;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should use ioredis-mock when useMock is true", () => {
        jest.mock("ioredis-mock", () => {
            return jest.fn().mockImplementation(() => ({
                on: jest.fn(),
                quit: jest.fn().mockResolvedValue(undefined),
            }));
        });

        const RedisMock = require("ioredis-mock");
        redisConnector = new RedisConnector(Config, true);

        expect(RedisMock).toHaveBeenCalledTimes(1);
    });

    it("should use real ioredis when useMock is false", () => {
        redisConnector = new RedisConnector(Config, false);
        expect(Redis).toHaveBeenCalledTimes(1);
    });

    it("should setup event listeners on connect", () => {
        redisConnector = new RedisConnector(Config, true);
        const mockRedis = redisConnector.getRedis();
        redisConnector.connect();
        expect(mockRedis.on).toHaveBeenCalledWith("connect", expect.any(Function));
        expect(mockRedis.on).toHaveBeenCalledWith("error", expect.any(Function));
    });

    it("should call quit on disconnect", async () => {
        redisConnector = new RedisConnector(Config, true);
        const mockRedis = redisConnector.getRedis();

        await redisConnector.disconnect();

        expect(mockRedis.quit).toHaveBeenCalledTimes(1);
    });
});
