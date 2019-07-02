import {IRedisConfig} from "../interfaces/redis-config.interface";
import {createClient, RedisClient} from "redis";

export class RedisService {
    protected static redisDBs: Map<string, RedisClient> = new Map();
    protected static config:IRedisConfig;
    constructor() {

    }

    public static setDefaultConfig(config:IRedisConfig){
        RedisService.config = config;
    }

    public static builder(identifier:string,
                          db: number | string = RedisService.config.db,
                          hostName: string = RedisService.config.host):RedisClient {
        let client;
        if (!(client = RedisService.getInstance(identifier))) {
            client = RedisService.setRedis(identifier,db, hostName);
        }
        return client;
    }

    public static getInstance(key: string) {
        return RedisService.redisDBs.has(key) ? RedisService.redisDBs.get(key) : null;
    }

    /**
     * returning new Redis client instance
     * @param identifier
     * @param db
     * @param hostname
     * @return redis.RedisClient
     */
    private static setRedis(identifier:string,db: number | string = RedisService.config.db, hostname: string = RedisService.config.host): RedisClient {
        let config = Object.assign({}, RedisService.config);
        config.db = db;
        config.host = hostname;
        let client = createClient(config);
        RedisService.redisDBs.set(identifier, client);
        return client;
    }
}