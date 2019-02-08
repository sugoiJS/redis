import { RedisClient } from "redis";
import { ScriptResource } from "./script-resource.class";
export declare class ScriptLoader {
    private _redisClient;
    scripts: Script[];
    constructor(_redisClient: RedisClient);
    reset(): void;
    loadScripts(...scripts: Array<ScriptResource>): void;
    loadScript(script: ScriptResource): void;
    execScripts(): Promise<any>;
}
export declare class Script {
    private _redisClient;
    sha: any;
    script: any;
    loader: Promise<Script>;
    args: string[];
    keys: any[];
    constructor(_redisClient: RedisClient);
    setArgs(...args: any[]): void;
    setKeys(...keys: any[]): void;
    fromFile(fileName: any): this;
    fromScript(script: any): this;
    private loadBuffer;
}
