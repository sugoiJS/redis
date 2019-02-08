"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util_1 = require("util");
class ScriptLoader {
    constructor(_redisClient) {
        this._redisClient = _redisClient;
        this.scripts = [];
    }
    reset() {
        this.scripts.length = 0;
    }
    loadScripts(...scripts) {
        scripts.forEach(script => this.loadScript(script));
    }
    loadScript(script) {
        let scriptItem;
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
            scriptItem.setArgs(...script['args']);
        }
        if (script['keys']) {
            scriptItem.setKeys(...script['keys']);
        }
        this.scripts.push(scriptItem);
    }
    execScripts() {
        return Promise.all(this.scripts.map(script => script.loader))
            .then((resolvedScripts) => {
            return Promise.all(resolvedScripts.map((resolvedScript) => __awaiter(this, void 0, void 0, function* () {
                if (resolvedScript.sha) {
                    return yield this._redisClient.evalsha(resolvedScript.sha, resolvedScript.keys.length, ...resolvedScript.keys, ...resolvedScript.args);
                }
                else {
                    return yield this._redisClient.eval(resolvedScript.script, resolvedScript.keys.length, ...resolvedScript.keys, ...resolvedScript.args);
                }
            })));
        });
    }
}
exports.ScriptLoader = ScriptLoader;
class Script {
    constructor(_redisClient) {
        this._redisClient = _redisClient;
        this.args = [];
        this.keys = [];
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
    loadBuffer(name) {
        const buffer$ = name.toLowerCase().split('.lua').length > 1
            ? util_1.promisify(fs.readFile).apply(fs, [name]).then(buffer => buffer.toString())
            : Promise.resolve(name);
        return this.loader = buffer$.then((script) => {
            this.script = script;
            return new Promise(resolve => this._redisClient.script('load', script, (err, sha) => resolve(sha)));
        })
            .then((sha) => {
            this.sha = sha;
            return this;
        });
    }
}
exports.Script = Script;
