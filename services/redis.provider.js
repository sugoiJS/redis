"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redis_exception_1 = require("../exceptions/redis.exception");
const exceptions_constant_1 = require("../constants/exceptions.constant");
const index_1 = require("rxjs/index");
const util_1 = require("util");
const redis_connection_types_constants_1 = require("../constants/redis-connection-types.constants");
const pub_sub_message_class_1 = require("../classes/pub-sub-message.class");
const operators_1 = require("rxjs/internal/operators");
const redis_intercept_proxy_1 = require("../classes/redis-intercept.proxy");
const script_loader_class_1 = require("../classes/script-loader.class");
const on_message_decorator_1 = require("../decorators/on-message.decorator");
class RedisProvider {
    constructor(config, connectionName, connectionType) {
        this._connectionName = connectionName;
        connectionName = RedisProvider.getConnectionName(connectionName, connectionType);
        this._config = config;
        if (connectionType === redis_connection_types_constants_1.RedisConnectionTypes.QUERY && this._config.isDefault) {
            RedisProvider.DEFAULT_CONNECTION = connectionName;
        }
        this._id = (++RedisProvider.ConnectionsCounter).toString();
        this.initClient();
        this.setDecoratorListeners();
    }
    static set RedisClient(value) {
        this._RedisClient = value;
    }
    static get RedisClient() {
        return this._RedisClient;
    }
    get connectionName() {
        return this._connectionName;
    }
    ;
    get client() {
        return this._client;
    }
    ;
    getRedisClient() {
        return this._client;
    }
    quit() {
        const types = [redis_connection_types_constants_1.RedisConnectionTypes.PUB, redis_connection_types_constants_1.RedisConnectionTypes.QUERY, redis_connection_types_constants_1.RedisConnectionTypes.SUB];
        const quitPromises = [];
        for (const type of types) {
            let client, connection;
            try {
                connection = RedisProvider.GetConnection(this._connectionName, type);
                client = connection.getRedisClient();
                const p = new Promise(resolve => {
                    client.quit((err, res) => {
                        resolve(res);
                    });
                });
                quitPromises.push(p);
            }
            catch (e) {
            }
        }
        return Promise.all(quitPromises).then(res => res.every(status => status === "OK"));
    }
    runAsyncMethod(method, ...args) {
        return util_1.promisify(method).apply(this._client, args);
    }
    publish(channel, value) {
        const client = this.getPublishClient().getRedisClient();
        return this.runAsyncMethod(client.publish, channel, value);
    }
    getSubscriber(byPattern, channelOrPattern) {
        const client = this.getSubscriberClient();
        return index_1.Observable.create(obs => {
            if (byPattern) {
                client.psubscribe(channelOrPattern);
                client.on("pmessage", (pattern, channel, data) => {
                    obs.next(new pub_sub_message_class_1.PubSubMessage(data, pub_sub_message_class_1.MessageType.data, channel).setPattern(pattern));
                });
                client.on("psubscribe", (channel, data) => {
                    obs.next(new pub_sub_message_class_1.PubSubMessage(data, pub_sub_message_class_1.MessageType.init, channel));
                });
            }
            else {
                client.subscribe(channelOrPattern);
                client.on("message", (channel, data) => {
                    obs.next(new pub_sub_message_class_1.PubSubMessage(data, pub_sub_message_class_1.MessageType.data, channel));
                });
                client.on("subscribe", (channel, data) => {
                    obs.next(new pub_sub_message_class_1.PubSubMessage(data, pub_sub_message_class_1.MessageType.init, channel));
                });
            }
            client.on("error", (channel, data) => {
                obs.err(new pub_sub_message_class_1.PubSubMessage(data, pub_sub_message_class_1.MessageType.error, channel));
            });
            client.on("unsubscribe", (channel, data) => this.onChannelClose(obs, channel, data));
            client.on("punsubscribe", (channel, data) => this.onChannelClose(obs, channel, data));
        })
            .pipe(operators_1.share(), operators_1.publish(), operators_1.refCount());
    }
    unsubscribe(byPattern, ...channelsOrPatterns) {
        const client = this.getSubscriberClient();
        return new Promise((resolve, reject) => {
            if (byPattern) {
                client.punsubscribe(...channelsOrPatterns, (err, name) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(name);
                });
            }
            else {
                client.unsubscribe(...channelsOrPatterns, (err, name) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(name);
                });
            }
        });
    }
    runScripts(...scripts) {
        this.loadScripts(...scripts);
        return this.execScripts();
    }
    loadScripts(...scripts) {
        if (!this._scriptLoader) {
            this._scriptLoader = new script_loader_class_1.ScriptLoader(this._client);
        }
        this._scriptLoader.loadScripts(...scripts);
    }
    execScripts() {
        return this._scriptLoader.execScripts().then((res) => {
            this._scriptLoader.reset();
            return res;
        });
    }
    //-------------- private methods ------------/
    initClient() {
        this._client = new RedisProvider.RedisClient(this._config);
    }
    setDecoratorListeners() {
        this.setDecoratorListener(this.connectionName, false);
        this.setDecoratorListener(this.connectionName, true);
        if (this.connectionName === RedisProvider.DEFAULT_CONNECTION_NAME) {
            this.setDecoratorListener("__SUG__DEFAULT", false);
            this.setDecoratorListener("__SUG__DEFAULT", true);
        }
    }
    setDecoratorListener(channel, byPattern) {
        let keyName = byPattern ? on_message_decorator_1.PATTERN_DECORATOR_KEY : on_message_decorator_1.CHANNEL_DECORATOR_KEY;
        keyName += channel;
        const keyNameSymbol = Symbol.for(keyName);
        const listeners = Reflect.getMetadata(keyNameSymbol, RedisProvider.prototype);
        Reflect.deleteMetadata(keyNameSymbol, RedisProvider.prototype);
        if (!listeners)
            return;
        Array.from(listeners).forEach((listener) => {
            this.getSubscriber(byPattern, listener.channelOrPattern)
                .pipe(operators_1.filter((msg) => msg.type === pub_sub_message_class_1.MessageType.data))
                .subscribe((msg) => listener.callback(msg));
        });
    }
    onChannelClose(obs, channel, data) {
        obs.next(new pub_sub_message_class_1.PubSubMessage(data, pub_sub_message_class_1.MessageType.close, channel));
        obs.complete();
    }
    getSubscriberClient() {
        return RedisProvider.CreateConnection(this._config, this._connectionName, redis_connection_types_constants_1.RedisConnectionTypes.SUB);
    }
    getPublishClient() {
        return RedisProvider.CreateConnection(this._config, this._connectionName, redis_connection_types_constants_1.RedisConnectionTypes.PUB);
    }
    static CreateConnection(connectionConfig, connectionName = RedisProvider.DEFAULT_CONNECTION_NAME, connectionType = redis_connection_types_constants_1.RedisConnectionTypes.QUERY) {
        try {
            return RedisProvider.GetConnection(connectionName, connectionType);
        }
        catch (err) {
        }
        const provider = new Proxy(new RedisProvider(connectionConfig, connectionName, connectionType), redis_intercept_proxy_1.RedisInterceptProxy.Factory());
        RedisProvider.Connections.set(RedisProvider.getConnectionName(connectionName, connectionType), provider);
        return provider;
    }
    static GetConnection(connectionName = RedisProvider.DEFAULT_CONNECTION_NAME, connectionType = redis_connection_types_constants_1.RedisConnectionTypes.QUERY) {
        connectionName = RedisProvider.getConnectionName(connectionName, connectionType);
        if (RedisProvider.Connections.has(connectionName)) {
            return RedisProvider.Connections.get(connectionName);
        }
        else {
            throw new redis_exception_1.RedisError(exceptions_constant_1.EXCEPTIONS.CONNECTION_NOT_FOUND.message, exceptions_constant_1.EXCEPTIONS.CONNECTION_NOT_FOUND.code, connectionName, false);
        }
    }
    static QuitAll() {
        return Array.from(this.Connections.values()).map(val => val.quit());
    }
    static getConnectionName(connectionName, connectionType) {
        return `${connectionName}_${connectionType}`;
    }
}
RedisProvider._RedisClient = redis_1.RedisClient;
RedisProvider.DEFAULT_CONNECTION_NAME = 'DEFAULT_CONNECTION';
RedisProvider.DEFAULT_CONNECTION = RedisProvider.DEFAULT_CONNECTION_NAME;
RedisProvider.ConnectionsCounter = 0;
RedisProvider.Connections = new Map();
exports.RedisProvider = RedisProvider;
