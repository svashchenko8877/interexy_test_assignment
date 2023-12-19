import http from "node:http";

export type Serializer = (data: any, req: http.IncomingMessage, res: http.ServerResponse) => string;

export interface Types {
    [key: string]: Serializer;
}

export interface Routing {
    [key: string]: string  | (() => any) | ((req: http.IncomingMessage, res: http.ServerResponse) => any);
}