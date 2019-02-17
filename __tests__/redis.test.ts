import {RedisClient} from "redis";
import {filter, finalize, take} from "rxjs/internal/operators";
import {
    OnRedisMessage,
    OnRedisPMessage,
    RedisProvider,
    MessageType,
    PubSubMessage,
    ScriptResource
} from "../index";

let client: RedisClient;
let connection: RedisProvider;

class DecoratorVerifier {
    static decoratorTestChannel;
    static decoratorTestPattern;

    @OnRedisMessage('decoratorTest', (msg) => {
        msg.data += "MW";
    })
    public static listener(data) {
        this.decoratorTestChannel = data
    }

    @OnRedisPMessage('decoratorTestPattern-*', (msg) => {
        msg.data += "MW";
    })
    public static patternListener(msg) {
        this.decoratorTestPattern = msg;
    }
};

beforeAll(async () => {
    connection = RedisProvider.CreateConnection({
        host: "127.0.0.1",
        port: 6379,
        isDefault: true
    });
    client = connection.getRedisClient();
    return await client;
});
afterAll(() => {
    client.flushall();
    RedisProvider.QuitAll();
});

describe("Redis basic", () => {

    it("check basic connection", () => {
        expect(RedisProvider.GetConnection().getRedisClient()).toBe(client)
    });

    it("check basic set", async () => {
        expect.assertions(1);
        await RedisProvider.GetConnection().set('test', '1');
        expect(await RedisProvider.GetConnection().get('test')).toEqual('1');
    });

});

describe("Redis pub/sub", () => {
    it("pub/sub by channel", async () => {
        expect.assertions(3);
        return await pubSubVerifier(false, 'testChannel')
    });

    it("pub/sub by pattern", async () => {
        expect.assertions(3);
        return await pubSubVerifier(true, 'room-*')
    });
});

describe("Redis pub/sub decorators", () => {
    it("pub/sub by channel", async () => {

        return await new Promise(async resolve => {
            await pubSubVerifier(false, 'decoratorTest');
            setTimeout(() => {
                expect(DecoratorVerifier.decoratorTestChannel).toBeDefined();
                expect(DecoratorVerifier.decoratorTestChannel.data.indexOf("MW")).toBeGreaterThanOrEqual(0);
                resolve();
            }, 0)

        })
    });

    it("pub/sub by pattern", async () => {
        return await new Promise(async resolve => {
            await pubSubVerifier(true, 'decoratorTestPattern-*');
            setTimeout(() => {
                expect(DecoratorVerifier.decoratorTestPattern).toBeDefined();
                expect(DecoratorVerifier.decoratorTestChannel.data.indexOf("MW")).toBeGreaterThanOrEqual(0);
                resolve();
            }, 0)
        })
    });
});

describe("Redis Scripts", () => {
    it("check redis lua inline script running", async () => {
        expect.assertions(1);
        await RedisProvider.GetConnection()
            .runScripts(ScriptResource
                .OfScript('return redis.call("HSET",KEYS[1],ARGV[1],ARGV[2])')
                .setKeys('inlineScriptTesting')
                .setArgs('FIELD', 'true')
            );
        expect(await RedisProvider.GetConnection().HGET('inlineScriptTesting', 'FIELD')).toBe('true');
    });

    it("check redis lua script running", async () => {
        expect.assertions(1);
        await RedisProvider.GetConnection().runScripts(
            ScriptResource.OfFile(__dirname + '/lua-scripts/dummy.lua')
        );
        expect(await RedisProvider.GetConnection().get('scriptTesting')).toBe('true');
    });
});

async function pubSubVerifier(byPattern: boolean, channelName: string) {
    let counter = 1;
    const mockVerifier = jest.fn((_data: PubSubMessage) => {
        expect(_data.data).toEqual("testing_" + (counter - 1));
    });

    return await new Promise(resolve => {
        const subscriber = RedisProvider.GetConnection()
            .getSubscriber(byPattern, channelName);

        subscriber.pipe(
            filter((msg: PubSubMessage) => msg.type === MessageType.data)
        )
            .subscribe(mockVerifier);

        subscriber.pipe(
            filter((msg: PubSubMessage) => msg.type === MessageType.init)
        )
            .subscribe(async (res) => {
                    const publishChannel = byPattern
                        ? channelName.split('*').join('1')
                        : channelName;
                    await RedisProvider.GetConnection().publish(publishChannel, "testing_" + counter++);
                    setTimeout(async () => {
                        await RedisProvider.GetConnection().publish(publishChannel, "testing_" + counter++);
                        await RedisProvider.GetConnection().unsubscribe(byPattern, channelName);
                    }, 0);
                })
        subscriber.subscribe(
            null,
            null,
            _=>{
                expect(mockVerifier).toBeCalledTimes(2);
                resolve()
            })
    })
}