import {IExceptionConstant} from "@sugoi/core";

export const EXCEPTIONS: { [prop: string]: IExceptionConstant } = {
    WRONG_INSTANCE_TYPE_SUBSCRIBE: {code: 6000,message: "Instance not set to be of type subscribe"},
    CONNECTION_NOT_FOUND: {code: 6001, message: "Connection not found"}
};