import {Observable} from "rxjs/index";

export interface IRedisProvider {
    publish(channel: string, value: string): Promise<number>;

    quit(): Promise<boolean>;

    getSubscriber<DataType>(byPattern: false, channel: string): Observable<DataType>

    getSubscriber<DataType>(byPattern: true, pattern: string): Observable<DataType>

    unsubscribe(byPattern: false, channel?: string): Promise<string[]>;

    unsubscribe(byPattern: true, pattern?: string): Promise<string[]>;

    runScripts(...scripts: Array<string|{fileName?:string, script?:string, args?:string[]}>): Promise<any>;
}