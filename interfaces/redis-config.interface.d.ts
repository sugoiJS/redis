import { ClientOpts } from "redis";
export declare type IRedisConfig = ClientOpts & {
    isDefault?: boolean;
};
