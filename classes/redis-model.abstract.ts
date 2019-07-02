import {RedisService} from "../services/redis.service";
import {RedisClient} from "redis";
import {RedisConnectionTypes} from "../constants/redis-connection-types.constants";
import {RedisError} from "../exceptions/redis.exception";
import {EXCEPTIONS} from "../constants/exceptions.constant";

export class RedisModel {
    public instance: RedisClient;
    public type: RedisConnectionTypes;
    protected db: number;
    protected host: string;

    public get redis() {
        return this.instance;
    }

    constructor(db: number, type: RedisConnectionTypes = RedisConnectionTypes.QUERY, host: string = null) {
        this.db = db;
        this.host = host;
        this.type = type;
        this.instance = RedisService.builder(db + type, db, host);
    }

    subscribe(event: string) {
        if (this.type !== RedisConnectionTypes.SUB)
            throw new RedisError(EXCEPTIONS.WRONG_INSTANCE_TYPE_SUBSCRIBE.message, EXCEPTIONS.WRONG_INSTANCE_TYPE_SUBSCRIBE.code, RedisConnectionTypes[this.type]);
        this.redis.subscribe(event);
    }

}