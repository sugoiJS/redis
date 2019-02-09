"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/internal/operators");
const index_1 = require("../index");
let client;
let connection;
class DecoratorVerifier {
    static listener(data) {
        this.decoratorTestChannel = data;
    }
    static patternListener(msg) {
        this.decoratorTestPattern = msg;
    }
}
__decorate([
    index_1.OnRedisMessage('decoratorTest', (msg) => {
        msg.data += "MW";
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DecoratorVerifier, "listener", null);
__decorate([
    index_1.OnRedisPMessage('decoratorTestPattern-*', null, (msg) => {
        msg.data += "MW";
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DecoratorVerifier, "patternListener", null);
;
beforeAll(() => __awaiter(this, void 0, void 0, function* () {
    connection = index_1.RedisProvider.CreateConnection({
        host: "127.0.0.1",
        port: 6379,
        isDefault: true
    });
    client = connection.getRedisClient();
    return yield client;
}));
afterAll(() => {
    client.flushall();
    index_1.RedisProvider.QuitAll();
});
describe("Redis basic", () => {
    it("check basic connection", () => {
        expect(index_1.RedisProvider.GetConnection().getRedisClient()).toBe(client);
    });
    it("check basic set", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        yield index_1.RedisProvider.GetConnection().set('test', '1');
        expect(yield index_1.RedisProvider.GetConnection().get('test')).toEqual('1');
    }));
});
describe("Redis pub/sub", () => {
    it("pub/sub by channel", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        return yield pubSubVerifier(false, 'testChannel');
    }));
    it("pub/sub by pattern", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        return yield pubSubVerifier(true, 'room-*');
    }));
});
describe("Redis pub/sub decorators", () => {
    it("pub/sub by channel", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(5);
        return yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield pubSubVerifier(false, 'decoratorTest');
            setTimeout(() => {
                expect(DecoratorVerifier.decoratorTestChannel).toBeDefined();
                expect(DecoratorVerifier.decoratorTestChannel.data.indexOf("MW")).toBeGreaterThanOrEqual(0);
                resolve();
            }, 0);
        }));
    }));
    it("pub/sub by pattern", () => __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            expect.assertions(5);
            yield pubSubVerifier(true, 'decoratorTestPattern-*');
            setTimeout(() => {
                expect(DecoratorVerifier.decoratorTestPattern).toBeDefined();
                expect(DecoratorVerifier.decoratorTestChannel.data.indexOf("MW")).toBeGreaterThanOrEqual(0);
                resolve();
            }, 0);
        }));
    }));
});
describe("Redis Scripts", () => {
    it("check redis lua inline script running", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        yield index_1.RedisProvider.GetConnection()
            .runScripts(index_1.ScriptResource
            .OfScript('return redis.call("HSET",KEYS[1],ARGV[1],ARGV[2])')
            .setKeys('inlineScriptTesting')
            .setArgs('FIELD', 'true'));
        expect(yield index_1.RedisProvider.GetConnection().HGET('inlineScriptTesting', 'FIELD')).toBe('true');
    }));
    it("check redis lua script running", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        yield index_1.RedisProvider.GetConnection().runScripts(index_1.ScriptResource.OfFile(__dirname + '/lua-scripts/dummy.lua'));
        expect(yield index_1.RedisProvider.GetConnection().get('scriptTesting')).toBe('true');
    }));
});
function pubSubVerifier(byPattern, channelName) {
    return __awaiter(this, void 0, void 0, function* () {
        let counter = 1;
        const mockVerifier = jest.fn((_data) => {
            expect(_data.data).toEqual("testing_" + (counter - 1));
        });
        return yield new Promise(resolve => {
            const subscriber = index_1.RedisProvider.GetConnection()
                .getSubscriber(byPattern, channelName);
            subscriber.pipe(operators_1.filter((msg) => msg.type === index_1.MessageType.data)).subscribe(mockVerifier);
            subscriber.pipe(operators_1.filter((msg) => msg.type === index_1.MessageType.init))
                .subscribe((res) => __awaiter(this, void 0, void 0, function* () {
                const publishChannel = byPattern
                    ? channelName.split('*').join('1')
                    : channelName;
                yield index_1.RedisProvider.GetConnection().publish(publishChannel, "testing_" + counter++);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield index_1.RedisProvider.GetConnection().publish(publishChannel, "testing_" + counter++);
                    yield index_1.RedisProvider.GetConnection().unsubscribe(byPattern, channelName);
                }), 0);
            }), _ => {
            }, _ => {
                expect(mockVerifier).toBeCalledTimes(2);
                resolve();
            });
        });
    });
}
