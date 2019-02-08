import { PubSubMessage } from "../classes/pub-sub-message.class";
export declare type TValid = boolean | Promise<boolean> | void;
export declare const CHANNEL_DECORATOR_KEY = "REDIS_CHANNEL_LISTENER_";
export declare const PATTERN_DECORATOR_KEY = "REDIS_PATTERN_LISTENER_";
export declare function OnRedisMessage<ResponseType = any>(channel: string, middleware: (msg: PubSubMessage<ResponseType>) => TValid, ...middlewares: Array<(msg: PubSubMessage<ResponseType>) => TValid>): any;
export declare function OnRedisMessage<ResponseType = any>(channel: string, connectionName?: string, ...middlewares: Array<(msg: PubSubMessage<ResponseType>) => TValid>): any;
export declare function OnRedisPMessage<ResponseType = any>(channel: string, middleware: (msg: PubSubMessage<ResponseType>) => TValid, ...middlewares: Array<(msg: PubSubMessage<ResponseType>) => TValid>): any;
export declare function OnRedisPMessage<ResponseType = any>(channel: string, connectionName?: string, ...middlewares: Array<(msg: PubSubMessage<ResponseType>) => TValid>): any;
