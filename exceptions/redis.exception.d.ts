import { SugoiError } from "@sugoi/core";
export declare class RedisError extends SugoiError {
    constructor(message: string, code: number, data?: any);
}
