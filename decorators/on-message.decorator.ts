import {RedisProvider} from "../services/redis.provider";
import {PubSubMessage} from "../classes/pub-sub-message.class";

export type TValid = boolean | Promise<boolean> | void;
export const CHANNEL_DECORATOR_KEY = "REDIS_CHANNEL_LISTENER_";
export const PATTERN_DECORATOR_KEY = "REDIS_PATTERN_LISTENER_";

export function OnRedisMessage<ResponseType = any>(channel: string,
                                                   middleware: (msg: PubSubMessage<ResponseType>) => TValid,
                                                   ...middlewares: Array<(msg: PubSubMessage<ResponseType>) => TValid>);
export function OnRedisMessage<ResponseType = any>(channel: string,
                                                   connectionName?: string,
                                                   ...middlewares: Array<(msg: PubSubMessage<ResponseType>) => TValid>);
export function OnRedisMessage<ResponseType = any>(channel: string,
                                                   connectionName: ((msg: PubSubMessage<ResponseType>) => TValid) | string = null,
                                                   ...middlewares: Array<(msg: PubSubMessage<ResponseType>) => TValid>) {
    if(typeof connectionName === "function"){
        middlewares.unshift(connectionName as any);
        connectionName = null;
    }
    if (!connectionName) {
        connectionName = "__SUG__DEFAULT";
    }
    return function (target,
                     property,
                     descriptor: TypedPropertyDescriptor<(msg: PubSubMessage<ResponseType>) => any>) {

        registerMeta(CHANNEL_DECORATOR_KEY + connectionName, channel, descriptor.value, target, ...middlewares);
    }
}


export function OnRedisPMessage<ResponseType = any>(channel: string,
                                                   middleware: (msg: PubSubMessage<ResponseType>) => TValid,
                                                   ...middlewares: Array<(msg: PubSubMessage<ResponseType>) => TValid>);
export function OnRedisPMessage<ResponseType = any>(channel: string,
                                                   connectionName?: string,
                                                   ...middlewares: Array<(msg: PubSubMessage<ResponseType>) => TValid>);
export function OnRedisPMessage(pattern: string,
                                connectionName: ((msg: PubSubMessage<ResponseType>) => TValid) | string = null,
                                ...middlewares: Array<(msg: PubSubMessage<ResponseType>) => TValid>) {
    if(typeof connectionName === "function"){
        middlewares.unshift(connectionName as any);
        connectionName = null;
    }
    if (!connectionName) {
        connectionName = "__SUG__DEFAULT";
    }
    return function (target,
                     property,
                     descriptor: TypedPropertyDescriptor<(msg: PubSubMessage<ResponseType>) => any>) {
        registerMeta(PATTERN_DECORATOR_KEY + connectionName, pattern, descriptor.value, target, ...middlewares)
    }
}


function registerMeta(key: string, channelOrPattern: string, originalCallback, target, ...middlewares) {
    const keySymbol = Symbol.for(key);
    const callback = new Proxy(originalCallback, {
        apply: async (functionTarget, thisArg, argArray) => {
            let valid;
            for (let middleware of middlewares) {
                valid = await middleware.apply(target, argArray);
                if (valid === false) {
                    break;
                }
            }
            if (valid !== false) {
                originalCallback.apply(target, argArray);
            }
        }
    });
    const dataSet = Reflect.getMetadata(keySymbol, RedisProvider.prototype) || new Set();
    dataSet.add({channelOrPattern, callback});
    Reflect.defineMetadata(keySymbol, dataSet, RedisProvider.prototype);
}