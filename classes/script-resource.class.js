"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ScriptResource {
    constructor(filePath, script, args, keys) {
        this.filePath = filePath;
        this.script = script;
        this.args = args;
        this.keys = keys;
    }
    static OfScript(script) {
        return new this(null, script);
    }
    static OfFile(filePath) {
        return new this(filePath);
    }
    setArgs(...args) {
        this.args = args;
        return this;
    }
    setKeys(...keys) {
        this.keys = keys;
        return this;
    }
}
exports.ScriptResource = ScriptResource;
