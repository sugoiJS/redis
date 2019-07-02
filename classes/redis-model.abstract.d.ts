import { RedisClient } from "redis";
import { RedisConnectionTypes } from "../constants/redis-connection-types.constants";
export declare class RedisModel {
    instance: RedisClient;
    type: RedisConnectionTypes;
    protected db: number;
    protected host: string;
    readonly redis: RedisClient;
    constructor(db: number, type?: RedisConnectionTypes, host?: string);
    subscribe(event: string): void;
}
