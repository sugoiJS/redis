export declare class ScriptResource {
    filePath?: string;
    script?: string;
    args?: string[];
    keys?: string[];
    constructor(filePath?: string, script?: string, args?: string[], keys?: string[]);
    static OfScript(script: string): ScriptResource;
    static OfFile(filePath: string): ScriptResource;
    setArgs(...args: string[]): this;
    setKeys(...keys: string[]): this;
}
