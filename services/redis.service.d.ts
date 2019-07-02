import * as redis from "redis";
import { IRedisConfig } from "../interfaces/redis-config.interface";
export declare class RedisService {
    protected static redisDBs: Map<string, redis.RedisClient>;
    protected static config: IRedisConfig;
    constructor();
    static setConfig(config: IRedisConfig): void;
    static builder(key: string, db: number, hostName?: string): redis.RedisClient;
    static getInstance(room: string): redis.RedisClient;
    /**
     * returning new Redis client instance
     * @param key
     * @param db
     * @param hostname
     * @return redis.RedisClient
     */
    private static setRedis;
}
