import {RedisClient} from "redis";
import * as fs from "fs";
import {promisify} from "util";
import {ScriptResource} from "./script-resource.class";
import {async} from "rxjs/internal/scheduler/async";

export class ScriptLoader {
    scripts: Script[] = [];

    constructor(private _redisClient: RedisClient) {
    }

    reset() {
        this.scripts.length = 0;
    }

    loadScripts(...scripts: Array<ScriptResource>) {
        scripts.forEach(script => this.loadScript(script));
    }


    loadScript(script: ScriptResource) {
        let scriptItem: Script;
        if (script['filePath']) {
            scriptItem = new Script(this._redisClient).fromFile(script['filePath']);
        }
        else if (script['script']) {
            scriptItem = new Script(this._redisClient).fromScript(script['script']);
        }
        else {
            scriptItem = new Script(this._redisClient).fromScript(script);
        }
        if (script['args']) {
            scriptItem.setArgs(...script['args'])
        }
        if (script['keys']) {
            scriptItem.setKeys(...script['keys'])
        }
        this.scripts.push(scriptItem);
    }

    execScripts(): Promise<any> {
        return Promise.all(this.scripts.map(script => script.loader))
            .then((resolvedScripts: Script[]) => {
                return Promise.all(resolvedScripts.map(async resolvedScript =>{
                    try {
                        return await this._redisClient.evalsha(resolvedScript.sha, resolvedScript.keys.length, ...resolvedScript.keys, ...resolvedScript.args) as any
                    }catch (err){
                        return await this._redisClient.eval(resolvedScript.script, resolvedScript.keys.length, ...resolvedScript.keys, ...resolvedScript.args) as any
                    }
                }));
            })
    }
}

export class Script {
    public sha: any;
    public script: any;
    public loader: Promise<Script>;
    public args: string[] = [];
    public keys: any[] = [];

    constructor(private _redisClient: RedisClient) {
    }

    setArgs(...args) {
        this.args = args;
    }

    setKeys(...keys) {
        this.keys = keys;
    }

    fromFile(fileName) {
        this.loadBuffer(fileName);
        return this;
    }

    fromScript(script) {
        this.loadBuffer(script);
        return this;
    }

    private loadBuffer(name) {
        const buffer$ = name.toLowerCase().split('.lua').length > 1
            ? promisify(fs.readFile).apply(fs, [name])
            : Promise.resolve(name);
        return this.loader = buffer$.then((script) => {
            this.script = script;
            return (<any>this._redisClient.script('load', script))
        })
            .then((sha) => {
                this.sha = sha;
                return this;
            });
    }
}
