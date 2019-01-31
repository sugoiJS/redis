import {ClientOpts} from "redis";

export type IRedisConfig = ClientOpts & {
    isDefault?: boolean
}