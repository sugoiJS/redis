export class ScriptResource {
    constructor(public filePath?: string,
                public script?: string,
                public args?: string[],
                public keys?: string[]) {

    }

    static OfScript(script:string){
        return new this(null,script);
    }

    static OfFile(filePath:string){
        return new this(filePath);
    }

    setArgs(...args:string[]){
        this.args = args;
        return this;
    }

    setKeys(...keys:string[]){
        this.keys = keys;
        return this;
    }
}