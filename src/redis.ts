import Redis from "ioredis";
import Config from "./config/config";


class RedisConnector {
    private config: typeof Config

    private redis: Redis
    constructor(config: typeof Config, useMock: boolean = false) {
        this.config = config;
        if (useMock) {
            const RedisMock = require("ioredis-mock");
            this.redis = new RedisMock();
        } else {
            this.redis = new Redis(this.config.REDIS_URL);
        }
    }
    connect() {
        this.redis.on("connect", () => console.log("🟢 Redis connected"));
        this.redis.on("error", (err) => console.error("🔴 Redis error", err));
    }
    getRedis() {
        return this.redis
    }
    disconnect() {
        this.redis.quit()
        console.log("🔴 Redis Disconnected")
    };

}
export default RedisConnector;
