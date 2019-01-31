import {RedisProvider} from "../services/redis.provider";
import {RedisClient} from "redis";
import {filter} from "rxjs/internal/operators";
import {MessageType, PubSubMessage} from "../classes/pub-sub-message.class";
import {OnRedisMessage, OnRedisPMessage} from "../decorators/on-message.decorator";
import {ScriptResource} from "../classes/script-resource.class";

let client: RedisClient;
let connection: RedisProvider;

class DecoratorVerifier {
    static decoratorTestChannel;
    static decoratorTestPattern;

    @OnRedisMessage('decoratorTest', null, (msg) => {
        msg.data+="MW";
    })
    public static listener(data) {
        this.decoratorTestChannel = data
    }

    @OnRedisPMessage('decoratorTestPattern-*', null, (msg) => {
        msg.data+="MW";
    })
    public static patternListener(msg) {
        this.decoratorTestPattern = msg;
    }
};

beforeAll(() => {
    // RedisProvider.RedisClient = RedisMock;
    connection = RedisProvider.CreateConnection({
        host: "127.0.0.1",
        port: 6379,
        isDefault: true
    });
    client = connection.getRedisClient();
});
afterAll(() => {
    connection.quit()
});

describe("Redis basic", () => {

    it("check basic connection", () => {
        expect(RedisProvider.GetHandler().getRedisClient()).toBe(client)
    });

    it("check basic set", async () => {
        expect.assertions(1);
        await RedisProvider.GetHandler().set('test', '1');
        expect(await RedisProvider.GetHandler().get('test')).toEqual('1');
    });

});

describe("Redis pub/sub", () => {
    it("pub/sub by channel", async () => await pubSubVerifier(false, 'testChannel'));

    it("pub/sub by pattern", async () => await pubSubVerifier(true, 'room-*'));
});

describe("Redis pub/sub decorators", () => {
    it("pub/sub by channel", async () => {
        return await new Promise(async resolve => {
            await pubSubVerifier(false, 'decoratorTest');
            expect.assertions(5);
            setTimeout(()=>{
                expect(DecoratorVerifier.decoratorTestChannel).toBeDefined();
                expect(DecoratorVerifier.decoratorTestChannel.data.indexOf("MW")).toBeGreaterThanOrEqual(0);
                resolve();
            },0)

        })
    });

    it("pub/sub by pattern", async () => {
        return await new Promise(async resolve => {
            await pubSubVerifier(true, 'decoratorTestPattern-*');
            expect.assertions(5);
            setTimeout(()=>{
                expect(DecoratorVerifier.decoratorTestPattern).toBeDefined();
                expect(DecoratorVerifier.decoratorTestChannel.data.indexOf("MW")).toBeGreaterThanOrEqual(0);
                resolve();
            },0)
        })
    });
});

describe("Redis Scripts", () => {
    it("check redis lua inline script running", async () => {
        await RedisProvider.GetHandler()
            .runScripts(ScriptResource
                .OfScript('return redis.call("HSET",KEYS[1],ARGV[1],ARGV[2])')
                .setKeys('scriptTesting')
                .setArgs('FIELD','true')
            );
        expect(await RedisProvider.GetHandler().HGET('scriptTesting','FIELD')).toBe('true');
    });

    it("check redis lua script running", async () => {
        await RedisProvider.GetHandler().runScripts(
            ScriptResource.OfFile('__tests__/lua-scripts/dummy.lua')
        );
        expect(await RedisProvider.GetHandler().get('scriptTesting')).toBe('true');
    });
});

async function pubSubVerifier(byPattern: boolean, channelName: string) {
    expect.assertions(3);
    let counter = 1;
    const mockVerifier = jest.fn((_data: PubSubMessage) => {
        expect(_data.data).toEqual("testing_" + (counter - 1));
    });

    return await new Promise(resolve => {
        const subscriber = RedisProvider.GetHandler()
            .getSubscriber(byPattern, channelName);

        subscriber.pipe(
            filter((msg: PubSubMessage) => msg.type === MessageType.data)
        ).subscribe(mockVerifier);

        subscriber.pipe(
            filter((msg: PubSubMessage) => msg.type === MessageType.init)
        )
            .subscribe(async (res) => {
                    const publishChannel = byPattern
                        ? channelName.split('*').join('1')
                        : channelName;
                    await RedisProvider.GetHandler().publish(publishChannel, "testing_" + counter++);
                    setTimeout(async () => {
                        await RedisProvider.GetHandler().publish(publishChannel, "testing_" + counter++);
                        await RedisProvider.GetHandler().unsubscribe(byPattern, channelName);
                    }, 0);
                },
                _ => {
                },
                _ => {
                    expect(mockVerifier).toBeCalledTimes(2);
                    resolve()
                })
    })
}