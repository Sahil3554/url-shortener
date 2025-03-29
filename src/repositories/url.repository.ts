import { Prisma, PrismaClient, Url } from "@prisma/client";
import RedisConnector from "../redis";
import redis from "../redis";
import Redis from "ioredis";
export class URLRepository {
    redis: Redis
    prisma: PrismaClient
    constructor(redis: Redis, prisma: PrismaClient) {
        this.redis = redis;
        this.prisma = prisma;
    }
    async saveURL(shortUrl: string, longUrl: string) {
        console.log("Database ...");

        return await this.prisma.url.create({
            data: { longUrl, shortUrl },
        });
    }

    async getURL(shortUrl: string): Promise<Url | null> {
        console.log("Database ...");
        return await this.prisma.url.findUnique({
            where: { shortUrl },
        });
    }
}
