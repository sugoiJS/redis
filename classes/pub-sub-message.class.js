"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PubSubMessage {
    constructor(data, type, channel) {
        this.data = data;
        this.type = type;
        this.channel = channel;
        this.hasError = type === MessageType.error;
        if (this.hasError) {
            this.error = this.data;
            this.data = null;
        }
    }
    setPattern(pattern) {
        this.pattern = pattern;
        return this;
    }
}
exports.PubSubMessage = PubSubMessage;
var MessageType;
(function (MessageType) {
    MessageType["data"] = "data";
    MessageType["close"] = "close";
    MessageType["error"] = "error";
    MessageType["init"] = "init";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
