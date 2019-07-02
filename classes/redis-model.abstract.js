"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis_service_1 = require("../services/redis.service");
var redis_connection_types_constants_1 = require("../constants/redis-connection-types.constants");
var redis_exception_1 = require("../exceptions/redis.exception");
var exceptions_constant_1 = require("../constants/exceptions.constant");
var RedisModel = /** @class */ (function () {
    function RedisModel(db, type, host) {
        if (type === void 0) { type = redis_connection_types_constants_1.RedisConnectionTypes.QUERY; }
        if (host === void 0) { host = null; }
        this.db = db;
        this.host = host;
        this.type = type;
        this.instance = redis_service_1.RedisService.builder(db + type, db, host);
    }
    Object.defineProperty(RedisModel.prototype, "redis", {
        get: function () {
            return this.instance;
        },
        enumerable: true,
        configurable: true
    });
    RedisModel.prototype.subscribe = function (event) {
        if (this.type !== redis_connection_types_constants_1.RedisConnectionTypes.SUB)
            throw new redis_exception_1.RedisError(exceptions_constant_1.EXCEPTIONS.WRONG_INSTANCE_TYPE_SUBSCRIBE.message, exceptions_constant_1.EXCEPTIONS.WRONG_INSTANCE_TYPE_SUBSCRIBE.code, redis_connection_types_constants_1.RedisConnectionTypes[this.type]);
        this.redis.subscribe(event);
    };
    return RedisModel;
}());
exports.RedisModel = RedisModel;
