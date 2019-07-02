"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = require("redis");
var RedisService = /** @class */ (function () {
    function RedisService() {
    }
    RedisService.setDefaultConfig = function (config) {
        RedisService.config = config;
    };
    RedisService.builder = function (identifier, db, hostName) {
        if (db === void 0) { db = parseInt(RedisService.config.db); }
        if (hostName === void 0) { hostName = RedisService.config.host; }
        var client;
        if (!(client = RedisService.getInstance(identifier))) {
            client = RedisService.setRedis(identifier, db, hostName);
        }
        return client;
    };
    RedisService.getInstance = function (key) {
        return RedisService.redisDBs.has(key) ? RedisService.redisDBs.get(key) : null;
    };
    /**
     * returning new Redis client instance
     * @param identifier
     * @param db
     * @param hostname
     * @return redis.RedisClient
     */
    RedisService.setRedis = function (identifier, db, hostname) {
        if (db === void 0) { db = config.db; }
        if (hostname === void 0) { hostname = config.host; }
        var config = Object.assign({}, RedisService.config);
        config.db = db.toString();
        config.host = hostname;
        var client = redis_1.createClient(config);
        RedisService.redisDBs.set(identifier, client);
        return client;
    };
    RedisService.redisDBs = new Map();
    return RedisService;
}());
exports.RedisService = RedisService;
