# @Sugoi\redis

![Sugoi logo](https://sugoijs.com/assets/logo_inverse.png)

[![npm version](https://badge.fury.io/js/%40sugoi%2Fredis.svg)](https://badge.fury.io/js/%40sugoi%2Fredis)
[![Build Status](https://travis-ci.org/sugoiJS/redis.svg?branch=master)](https://travis-ci.org/sugoiJS/redis)
[![codecov](https://codecov.io/gh/sugoiJS/redis/branch/master/graph/badge.svg)](https://codecov.io/gh/sugoiJS/redis)


## Introduction
Sugoi is a minimal modular framework,
which gives you the ability to use only what you need, fast.
The sugoi framework redis module using the [redisClient](https://www.npmjs.com/package/redisClient).

As all of the "Sugoi" modules, this module is stand alone and can act without other Sugoi modules.

## Installation

> npm install @sugoi/redis --save

## Initialization

Initialization done by the static method `CreateConnection` of the `RedisProvider`

    static CreateConnection(connectionConfig: IRedisConfig, connectionName: string): TRedisProvider;


#### Basic

    const redisProvider = RedisProvider.CreateConnection({
        host: "127.0.0.1",
        port: 6379,
        isDefault: true
    });
    const resolvedClient = RedisProvider.getConnection();
    expect(redisProvider).toBe(resolvedClient); // Should be truthy

### Using [@sugoi/server](https://www.npmjs.com/package/@sugoi/server)

    @ServerModule({
        services: [
            {
                provide: RedisProvider.CreateConnection({
                                 host: "127.0.0.1",
                                 port: 6379,
                                 isDefault: true
                          }),
                useName: "RedisService"
            }
        ]
    })
    export class BootstrapModule {
        constructor(@Inject('RedisService') private _redisService: RedisProvider) {
        }
    }

## RedisProvider class

The RedisProvider class instance re-exports all of redis methods with promise handler for callback.

### Example

    await RedisProvider.GetConnection().set('test', '1');
    await RedisProvider.GetConnection().get('test'); // Result will be '1'

## Pub/Sub


### Publish

Publish done by redis client publish method

    publish(channel: string, value: string): Promise<number>;

#### Example

    RedisProvider.GetConnection().publish("room-1", "data");

### Subscribe

The subscription done by a single method that returns an observable object of type PubSubMessage

    public getSubscriber<DataType>(byPattern: boolean, channelOrPattern: string): Observable<PubSubMessage<DataType>>

`PubSubMessage` class

    {
        hasError: boolean;
        data: any;
        error: any;
        type: "data"|"close"|"error"|"init";
        channel: string;
        pattern?: string; // Only in case of pattern subscribe
    }

#### Example

    RedisProvider.GetConnection().getSubscriber(true, "room-*").subscribe(
    message=>{
        // handle message
    },
    err=>{
        // handle error
    });

#### Decorators

Another way to subscribe channel\pattern messages is using the following decorators

##### Subscribe to channel

    OnRedisMessage<ResponseType = any>(channel: string,...middlewares: Array<(msg: PubSubMessage<ResponseType>) => TValid>);

Or

    OnRedisMessage<ResponseType = any>(channel: string,connectionName?: string,...middlewares: Array<(msg: PubSubMessage<ResponseType>) => TValid>);

###### Example:

     @OnRedisMessage('decoratorTest', (msg) => {
        return msg.data > 10; // This middleware will act as filter,
                              // only messagea with data greater than 10 will continue to the next method

        })
        public static channelListener(data) {
            this.decoratorTestChannel = data
        }

##### Subscribe to pattern

    OnRedisPMessage<ResponseType = any>(channel: string,...middlewares: Array<(msg: PubSubMessage<ResponseType>) => TValid>);

Or

    OnRedisPMessage<ResponseType = any>(channel: string,connectionName?: string,...middlewares: Array<(msg: PubSubMessage<ResponseType>) => TValid>);

###### Example:

    @OnRedisPMessage('decoratorTestPattern-*', null, (msg:PubSubMessage<number>) => {
        return msg.data > 10; // This middleware will act as filter,
                              // only messagea with data greater than 10 will continue to the next method
    })
    public static patternListener(msg) {
        this.decoratorTestPattern = msg;
    }



## Scripts

Running lua scripts can be done using the `runScripts` method

    runScripts(...scripts: Array<ScriptResource>): Promise<any>

The `ScriptResource` provides an API for loading inline scripts and file scripts

### Inline scripts

Using the `ofScript` method allows us to create a script from inline text

#### Example:

    const inlineScriptResource = ScriptResource.OfScript('return redis.call("HSET",KEYS[1],ARGV[1],ARGV[2])')
                                                .setKeys('myKey')
                                                .setArgs('FIELD', 'myValue');
    await RedisProvider.GetConnection().runScripts(inlineScriptResource);

### File scripts

Using the `ofFile` method allows us to create a script from inline text

#### Example:

    const fileScriptResource = OfFile(__dirname + '/lua-scripts/myScript.lua')
                                                .setKeys('myKey')
                                                .setArgs('FIELD', 'myValue');
    await RedisProvider.GetConnection().runScripts(fileScriptResource);


## Documentation

You can find further information on [Sugoi official website](http://www.sugoijs.com)