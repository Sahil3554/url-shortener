import RedisConnector from "../redis";
import redis from "../redis";
import Redis from "ioredis";
export class URLRepository {
    redis: Redis
    constructor(redis: Redis) {
        this.redis = redis
    }
    async saveURL(shortCode: string, longUrl: string): Promise<void> {
        await this.redis.set(shortCode, longUrl, "EX", 86400); // Store with 24-hour expiry
    }

    async getURL(shortCode: string): Promise<string | null> {
        return await this.redis.get(shortCode);
    }
}
