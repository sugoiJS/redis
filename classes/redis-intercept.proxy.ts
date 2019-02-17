
export class RedisInterceptProxy {

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
            } else {
                return Reflect.get(target._client, prop).bind(target._client);
            }
        }
        return Reflect.get(target, prop);
    }

}


