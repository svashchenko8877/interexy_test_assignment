import http from 'node:http';
import {FileCache} from "./file-based-cached";


interface Routing {
    [key: string]: string  | (() => any) | ((req: http.IncomingMessage, res: http.ServerResponse) => any);
}

const PORT = 8000;
let fileCache: FileCache;

const routing: Routing = {
    '/': 'welcome to homepage',
    '/api/get_file/*': (client, params: any) => {
        const name = params[0];
        const file =  fileCache.get(name);
        return JSON.stringify({ file });
    },
    '/api/save_file/*': (client: http.IncomingMessage, params: any) => {
        const url = new URLSearchParams(params[0]);
        const key = url.get('key') as string;
        const value = url.get('value') as string;
        const ttl = url.get('ttl') as string;
        fileCache.set(key, value, +ttl)
        return JSON.stringify(`${key} saved`);
    }
};
type Serializer = (data: any, req: http.IncomingMessage, res: http.ServerResponse) => string;

interface Types {
     [key: string]: Serializer;
 }
const types: Types  = {
    object: (o) => JSON.stringify(o),
    string: (s) => s,
    number: (n) => n + '',
    undefined: () => 'not found',
    function: (fn, params, client) => fn(client, params),
};

const matching: any = [];
for (const key in routing) {
    if (key.includes('*')) {
        const rx = new RegExp(key.replace('*', '(.*)'));
        const route = routing[key];
        matching.push([rx, route]);
        delete routing[key];
    }
}

const router = (client: any) => {
    const { url } = client.req;
    let route = routing[url];
    let params = [];
    if (!route) {
        for (const rx of matching) {
            params = url.match(rx[0]);
            if (params) {
                params.shift();
                route = rx[1];
                break;
            }
        }
    }
    const type = typeof route;
    const renderer = types[type];
    return renderer(route, params, client);
};

http.createServer((req, res) => {
    fileCache = new FileCache('./');
    res.end(`${router({ req, res })}`);
}).listen(PORT);

console.log(`Running server on port ${PORT}`);