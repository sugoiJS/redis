"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RedisInterceptProxy {
    static Factory() {
        return new this();
    }
    get(target, prop, receiver) {
        if (!Reflect.has(target, prop)
            && Reflect.has(target._client, prop)) {
            if (typeof target._client[prop] === "function") {
                return new Proxy(target._client[prop], {
                    apply(applyTarget, thisArg, args) {
                        return Reflect.apply(target.runAsyncMethod, target, [applyTarget, ...args]);
                    }
                });
            }
            else {
                return Reflect.get(target._client, prop).bind(target._client);
            }
        }
        return Reflect.get(target, prop);
    }
}
exports.RedisInterceptProxy = RedisInterceptProxy;
// export class RedisClientProxy {
//     static Factory() {
//         return new this();
//     }
//
//
//     construct(className,args,proxy) {
//         const instance = Reflect.construct(className,args,proxy);
//         instance.runAsyncMethod = this.runAsyncMethod;
//         return new Proxy(instance,this)
//     }
//
//     apply(target, thisArg, argumentsList: any[]) {
//         return thisArg.runAsyncMethod(thisArg, target, ...argumentsList);
//     }
//
//     runAsyncMethod<Response = any>(thisArg,method: (...args) => any, ...args): Promise<Response> {
//         return promisify(method).apply(thisArg, args);
//     }
//
//
// }
