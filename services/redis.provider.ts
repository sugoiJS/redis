import {IRedisConfig} from "../interfaces/redis-config.interface";
import {RedisClient as _RedisClient} from "redis";
import {RedisError} from "../exceptions/redis.exception";
import {EXCEPTIONS} from "../constants/exceptions.constant";
import {Observable, Subject} from "rxjs/index";
import {IRedisProvider} from "../interfaces/redis-provider.interface";
import {promisify} from "util";
import {RedisConnectionTypes} from "../constants/redis-connection-types.constants";
import {MessageType, PubSubMessage} from "../classes/pub-sub-message.class";
import {filter, publish, refCount, share} from "rxjs/internal/operators";
import {RedisInterceptProxy} from "../classes/redis-intercept.proxy";
import {ScriptLoader} from "../classes/script-loader.class";
import {ScriptResource} from "../classes/script-resource.class";
import {CHANNEL_DECORATOR_KEY, PATTERN_DECORATOR_KEY} from "../decorators/on-message.decorator";
import {IRedisClientPromise} from "../interfaces/redis-client-promise.interface";

export type TRedisProvider = IRedisClientPromise & RedisProvider & _RedisClient;
export type TRedisClient = _RedisClient;

export class RedisProvider implements IRedisProvider {
    private static _RedisClient = _RedisClient;
    private static DEFAULT_CONNECTION_NAME = 'DEFAULT_CONNECTION';
    private static DEFAULT_CONNECTION: string = RedisProvider.DEFAULT_CONNECTION_NAME;
    private static ConnectionsCounter: number = 0;

    static Connections: Map<string, TRedisProvider> = new Map();

    static set RedisClient(value: any) {
        this._RedisClient = value;
    }

    static get RedisClient(): any {
        return this._RedisClient;
    }


    private _config: IRedisConfig;
    private _connectionName: string;
    private _id: string;
    private _client: TRedisClient;
    private _scriptLoader: ScriptLoader;

    public get connectionName(): string {
        return this._connectionName;
    };

    get client(): TRedisClient {
        return this._client;
    };

    protected constructor(config: IRedisConfig, connectionName: string, connectionType: RedisConnectionTypes) {
        this._connectionName = connectionName;
        connectionName = RedisProvider.getConnectionName(connectionName, connectionType);
        this._config = config;
        if (connectionType === RedisConnectionTypes.QUERY && this._config.isDefault) {
            RedisProvider.DEFAULT_CONNECTION = connectionName;
        }
        this._id = (++RedisProvider.ConnectionsCounter).toString();
        this.initClient();
        this.setDecoratorListeners();
    }

    public getRedisClient() {
        return this._client;
    }

    public quit(): Promise<boolean> {
        const types = [RedisConnectionTypes.PUB, RedisConnectionTypes.QUERY, RedisConnectionTypes.SUB];
        const quitPromises = [];
        for (const type of types) {
            let client, connection;
            try {
                connection = RedisProvider.GetConnection(this._connectionName, type);
                client = connection.getRedisClient();
                const p = new Promise((resolve, reject) => {
                    client.quit((err, res) => {
                        if(err){
                            return reject(err);
                        }
                        resolve(res);
                    });
                });
                quitPromises.push(p);
            } catch (e) {
            }
        }
        return Promise.all(quitPromises).then(res => res.every(status => status === "OK"));
    }

    public runAsyncMethod<Response = any>(method: (...args) => any, ...args): Promise<Response> {
        return promisify(method).apply(this._client, args);
    }


    public publish(channel: string, value: string): Promise<number> {
        const client = this.getPublishClient().getRedisClient();
        return this.runAsyncMethod<number>(client.publish, channel, value);
    }

    public getSubscriber<DataType>(byPattern: false, channel: string): Observable<PubSubMessage<DataType>>
    public getSubscriber<DataType>(byPattern: true, pattern: string): Observable<PubSubMessage<DataType>>
    public getSubscriber<DataType>(byPattern: boolean, channelOrPattern: string): Observable<PubSubMessage<DataType>> {

        const client = this.getSubscriberClient();
        const obs = Observable.create(obs => {
            if (byPattern) {
                client.psubscribe(channelOrPattern);
                client.on("pmessage", (pattern, channel, data) => {
                    obs.next(new PubSubMessage(data, MessageType.data, channel).setPattern(pattern));
                });
                client.on("psubscribe", (channel, data) => {
                    obs.next(new PubSubMessage(data, MessageType.init, channel));
                });
            } else {
                client.subscribe(channelOrPattern);
                client.on("message", (channel, data) => {
                    obs.next(new PubSubMessage(data, MessageType.data, channel));
                });
                client.on("subscribe", (channel, data) => {
                    obs.next(new PubSubMessage(data, MessageType.init, channel));
                });
            }

            client.on("error", (channel, data) => {
                obs.err(new PubSubMessage(data, MessageType.error, channel));
            });
            client.on("unsubscribe", (channel, data) => this.onChannelClose(obs, channel, data));
            client.on("punsubscribe", (channel, data) => this.onChannelClose(obs, channel, data));
        })
            .pipe(
                share()
            );
        return obs;
    }

    public unsubscribe(byPattern: false, ...channels: string[]): Promise<string[]>;

    public unsubscribe(byPattern: true, ...patterns: string[]): Promise<string[]>;
    public unsubscribe(byPattern: boolean, ...channelsOrPatterns: string[]): Promise<string[]> {
        const promises = [];
        for (let channel of channelsOrPatterns) {
            const client = this.getSubscriberClient().getRedisClient();
            const promise = new Promise((resolve, reject) => {
                if (byPattern) {
                    client.punsubscribe(channel,(err,data)=>{
                        if(err){
                            return reject(err)
                        }
                        resolve(data)
                    })
                } else {
                    client.unsubscribe(channel,(err,data)=>{
                        if(err){
                            return reject(err)
                        }
                        resolve(data)
                    })
                }
            })
            promises.push(promise);
        }
        return Promise.all(promises)
    }

    public runScripts(...scripts: Array<ScriptResource>): Promise<any> {
        this.loadScripts(...scripts);
        return this.execScripts();
    }


    public loadScripts(...scripts: Array<ScriptResource>) {
        if (!this._scriptLoader) {
            this._scriptLoader = new ScriptLoader(this._client);
        }
        this._scriptLoader.loadScripts(...scripts);
    }

    public execScripts() {
        return this._scriptLoader.execScripts().then((res) => {
            this._scriptLoader.reset();
            return res
        });
    }

    //-------------- private methods ------------/


    private initClient() {
        this._client = new RedisProvider.RedisClient(this._config);
    }

    private setDecoratorListeners() {
        this.setDecoratorListener(this.connectionName, false);
        this.setDecoratorListener(this.connectionName, true);
        if (this.connectionName === RedisProvider.DEFAULT_CONNECTION_NAME) {
            this.setDecoratorListener("__SUG__DEFAULT", false);
            this.setDecoratorListener("__SUG__DEFAULT", true);
        }
    }

    private setDecoratorListener(channel, byPattern) {
        let keyName = byPattern ? PATTERN_DECORATOR_KEY : CHANNEL_DECORATOR_KEY;
        keyName += channel;
        const keyNameSymbol = Symbol.for(keyName);
        const listeners = Reflect.getMetadata(keyNameSymbol, RedisProvider.prototype);
        Reflect.deleteMetadata(keyNameSymbol, RedisProvider.prototype);
        if (!listeners) return;
        Array.from(listeners).forEach((listener: any) => {
            this.getSubscriber(byPattern, listener.channelOrPattern)
                .pipe(filter((msg: PubSubMessage) => msg.type === MessageType.data))
                .subscribe((msg) => listener.callback(msg));
        })
    }


    private onChannelClose(obs, channel, data) {
        obs.next(new PubSubMessage(data, MessageType.close, channel));
        obs.complete();
    }

    private getSubscriberClient() {
        return RedisProvider.CreateConnection(this._config, this._connectionName, RedisConnectionTypes.SUB);
    }

    private getPublishClient() {
        return RedisProvider.CreateConnection(this._config, this._connectionName, RedisConnectionTypes.PUB);
    }

    //-------------- static methods ------------/

    static CreateConnection(connectionConfig: IRedisConfig): TRedisProvider;
    static CreateConnection(connectionConfig: IRedisConfig, connectionName: string): TRedisProvider;
    static CreateConnection(connectionConfig: IRedisConfig, connectionName: string, connectionType: RedisConnectionTypes): TRedisProvider;
    static CreateConnection(connectionConfig: IRedisConfig,
                            connectionName: string = RedisProvider.DEFAULT_CONNECTION_NAME,
                            connectionType: RedisConnectionTypes = RedisConnectionTypes.QUERY): TRedisProvider {
        try {
            return RedisProvider.GetConnection(connectionName, connectionType);
        } catch (err) {
        }
        const provider = new Proxy(
            new RedisProvider(connectionConfig, connectionName, connectionType),
            RedisInterceptProxy.Factory()
        ) as TRedisProvider;

        RedisProvider.Connections.set(RedisProvider.getConnectionName(connectionName, connectionType), provider);
        return provider;
    }


    public static GetConnection();
    public static GetConnection(connectionName: string);
    public static GetConnection(connectionName: string, connectionType: RedisConnectionTypes);
    public static GetConnection(connectionName: string = RedisProvider.DEFAULT_CONNECTION_NAME,
                                connectionType: RedisConnectionTypes = RedisConnectionTypes.QUERY): TRedisProvider {
        connectionName = RedisProvider.getConnectionName(connectionName, connectionType);
        if (RedisProvider.Connections.has(connectionName)) {
            return RedisProvider.Connections.get(connectionName);
        } else {
            throw new RedisError(EXCEPTIONS.CONNECTION_NOT_FOUND.message, EXCEPTIONS.CONNECTION_NOT_FOUND.code, connectionName, false);
        }
    }

    public static QuitAll() {
        return Array.from(this.Connections.values()).map(val => val.quit())
    }

    protected static getConnectionName(connectionName: string, connectionType: RedisConnectionTypes) {
        return `${connectionName}_${connectionType}`;
    }
}