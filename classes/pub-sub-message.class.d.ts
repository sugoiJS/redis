export declare class PubSubMessage<DataType = any> {
    data: DataType;
    type: MessageType;
    channel: string;
    pattern: string;
    error: any;
    hasError: boolean;
    constructor(data: DataType, type: MessageType, channel: string);
    setPattern(pattern: string): this;
}
export declare enum MessageType {
    "data" = "data",
    "close" = "close",
    "error" = "error",
    "init" = "init"
}
