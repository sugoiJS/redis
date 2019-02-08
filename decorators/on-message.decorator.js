"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_provider_1 = require("../services/redis.provider");
exports.CHANNEL_DECORATOR_KEY = "REDIS_CHANNEL_LISTENER_";
exports.PATTERN_DECORATOR_KEY = "REDIS_PATTERN_LISTENER_";
function OnRedisMessage(channel, connectionName = null, ...middlewares) {
    if (typeof connectionName === "function") {
        middlewares.unshift(connectionName);
        connectionName = null;
    }
    if (!connectionName) {
        connectionName = "__SUG__DEFAULT";
    }
    return function (target, property, descriptor) {
        registerMeta(exports.CHANNEL_DECORATOR_KEY + connectionName, channel, descriptor.value, target, ...middlewares);
    };
}
exports.OnRedisMessage = OnRedisMessage;
function OnRedisPMessage(pattern, connectionName = null, ...middlewares) {
    if (typeof connectionName === "function") {
        middlewares.unshift(connectionName);
        connectionName = null;
    }
    if (!connectionName) {
        connectionName = "__SUG__DEFAULT";
    }
    return function (target, property, descriptor) {
        if (!connectionName) {
            connectionName = "__SUG__DEFAULT";
        }
        registerMeta(exports.PATTERN_DECORATOR_KEY + connectionName, pattern, descriptor.value, target, ...middlewares);
    };
}
exports.OnRedisPMessage = OnRedisPMessage;
function registerMeta(key, channelOrPattern, originalCallback, target, ...middlewares) {
    const keySymbol = Symbol.for(key);
    const callback = new Proxy(originalCallback, {
        apply: (functionTarget, thisArg, argArray) => __awaiter(this, void 0, void 0, function* () {
            let valid;
            for (let middleware of middlewares) {
                valid = yield middleware.apply(target, argArray);
                if (valid === false) {
                    break;
                }
            }
            if (valid !== false) {
                originalCallback.apply(target, argArray);
            }
        })
    });
    const dataSet = Reflect.getMetadata(keySymbol, redis_provider_1.RedisProvider.prototype) || new Set();
    dataSet.add({ channelOrPattern, callback });
    Reflect.defineMetadata(keySymbol, dataSet, redis_provider_1.RedisProvider.prototype);
}
