import { router } from "./router.js";
import type ws from "ws";
import { WebSocketServer } from "ws";
import type {IncomingMessage} from "http";
import type {Duplex} from "stream";
type callbackFunction = (
  req:IncomingMessage,
  socket: ws.WebSocket,
  next: () => void
) => void | Promise<void>;
export class wsRouter {
  _router: ReturnType<typeof router<{ ws: {}; wss: {} }>>;
  _websocketServer: WebSocketServer;
  constructor() {
    this._router = new router({ ws: {}, wss: {} });
    this._websocketServer = new WebSocketServer({ noServer: true });
  }
  ws(path: string, listener: callbackFunction) {
    this._router.routes.ws.paths.push([path, listener]);
  }
  wss(path: string, listener: callbackFunction) {
    this._router.routes.wss.paths.push([path, listener]);
  }
  async upgradeHandler(
    isSecure: boolean,
    request:IncomingMessage,
    requestSocket:Duplex, 
    head:Buffer
  ): Promise<void> {
    const routes = this._router.getRoutes(
      request.url as string,
      isSecure ? "wss" : "ws"
    ) as callbackFunction[];
    if(routes.length === 0){
      requestSocket.destroy();
      return;
    }
    const [socket] = await new Promise<[ws, IncomingMessage]>((resolve) => this._websocketServer.handleUpgrade(
      request,
      requestSocket,
      head,(...args) => resolve(args)));
    let isAlive = true;
    const interval = setInterval(function () {
      if (!isAlive) {
        socket.terminate();
      }
      socket.ping();
      isAlive = false;
    }, 30000);
    socket.on("close", () => clearInterval(interval));
    socket.on("pong", () => (isAlive = true));
    const run = async () =>
      {try {await (routes.shift() || (() => {}))(request,socket, () => process.nextTick(run))}catch(e){console.error(e);socket.close(1011)}};
    run();
  }
}
