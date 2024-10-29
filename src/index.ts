import { httpServer } from './http_server';
import { serverWebsocket } from './websocket/websocket.server';

const HTTP_PORT = 8181;
const WEBSOCKET_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
serverWebsocket.listen(WEBSOCKET_PORT);
