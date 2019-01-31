export class PubSubMessage<DataType = any> {
    public pattern: string;
    public error: DataType;
    public hasError: boolean;
    constructor(public data: DataType,
                public type: MessageType,
                public channel: string) {
        this.hasError = type === MessageType.error;
        if(this.hasError){
            this.error = this.data;
            this.data = null;
        }
    }

    setPattern(pattern: string){
        this.pattern = pattern;
        return this;
    }

}

export enum MessageType{
    "data" = "data",
    "close" = "close",
    "error" = "error",
    "init" = "init"
}