// A improved version of https://gist.github.com/Coolchickenguy/a424ab0f4d32f024b39cd8cdd2b912ae
import tls from "tls";
import http from "http";
import { ServerOptions } from "https";
import net from "net";
//I use the word "proxy" but it doesn't create an additional request, it directly passes the data to the http server after decrypting it, essentially the same as what is internaly done inside the https module.
/**
 * Create a https server that redirects all http requests on the same port to it.
 * @param app Http request listener
 * @param options Https options
 * @param config The port to host to or the config object
 * @param callbackFunction A callback for whan the server has started
 */
export function listen(
  app: http.RequestListener<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >,
  options: ServerOptions<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >,
  config:
    | number
    | {
        port: number;
        secureServer?: http.Server;
        insecureServer?: http.Server;
      },
  callbackFunction: (serverInstance: {
    /**
     * If the server has been kiled
     */
    get isAlive(): boolean;
    /**
     * Kill the server
     * @returns A promise that resolves when the server ends
     */
    kill(): Promise<void>;
    /**
     * Change the server options
     * @param newOptions The new server options
     */
    refresh(
      newOptions: ServerOptions<
        typeof http.IncomingMessage,
        typeof http.ServerResponse
      >
    ): void;
    /**
     * Start intercepting requests
     * @param callbackFunction The callback for intercepted requests.
     */
    startIntercept(
      callbackFunction: (
        request: Buffer,
        socket: net.Socket
      ) => true | void | Promise<true | void>
    ): void;
    /**
     * Stop intercepting requests
     */
    removeIntercept(
      callbackFunction: (
        request: Buffer,
        socket: net.Socket
      ) => true | void | Promise<true | void>
    ): void;
    /**
     * The callbacks for request interception
     */
    get interceptCallbacks(): ((
      request: Buffer,
      socket: net.Socket
    ) => true | void | Promise<true | void>)[];
    /**
     * Ref the server
     */
    ref(): void;
    /**
     * Unref the server
     */
    unref(): void;
    /**
     * The function passed to the tcp server to intercept requests from the default callback
     */
    get requestIntercepter(): (socket: net.Socket) => void;
    get secureServer(): http.Server;
    set secureServer(value: http.Server);
    get insecureServer(): http.Server;
    set insecureServer(value: http.Server);
  }) => void
) {
  // The normal server ( MUST be http or else it will try sorting the encription out itself and will fail in this configuration)
  // This is just as secure as the normal nodejs https server
  const makeSecureServer = () => http.createServer(options, app);
  // A server that redirect all the requests to https, you could have this be the normal server too.
  const makeInsecureServer = () =>
    http.createServer(options, function (req, res) {
      res.writeHead(302, {
        location: `https://${req.headers.host || "localhost" + req.url}`,
      });
      res.end();
    });
  let normalizedConfig: {
    port: number;
    secureServer: http.Server;
    insecureServer: http.Server;
  };
  // Normalize config
  if (typeof config === "number") {
    normalizedConfig = {
      port: config,
      secureServer: makeSecureServer(),
      insecureServer: makeInsecureServer(),
    };
  } else {
    normalizedConfig = {
      port: config.port,
      secureServer: config.secureServer || makeSecureServer(),
      insecureServer: config.insecureServer || makeInsecureServer(),
    };
  }
  // The tcp server that receves all the requests
  var tcpserver = net.createServer();

  var server = normalizedConfig.secureServer;
  var redirectServer = normalizedConfig.insecureServer;
  // Make the proxy server listen
  tcpserver.listen(typeof config === "number" ? config : config.port);
  // Call the callback when the server is ready
  tcpserver.on("listening", () =>
    callbackFunction(
      new (class serverInstance {
        #isAlive: boolean = true;
        get isAlive(): boolean {
          return this.#isAlive;
        }
        /**
         * Kill the server
         * @returns A promise that resolves when the server ends
         */
        async kill(): Promise<void> {
          return new Promise<void>((resolve, fail) => {
            tcpserver.close((err) =>
              (typeof err == "undefined"
                ? () => {
                    server.closeAllConnections();
                    redirectServer.closeAllConnections();
                    this.#isAlive = false;
                    resolve();
                  }
                : () => {
                    fail(err);
                  })()
            );
          });
        }
        /**
         * Change the server options
         * @param newOptions The new server options
         */
        refresh(
          newOptions: ServerOptions<
            typeof http.IncomingMessage,
            typeof http.ServerResponse
          >
        ): void {
          options = newOptions;
        }
        /**
         * The request intercepter function
         */
        // Use arrow function to avoid "this" being set to the server (I dont want to bind)
        #intercepter = (socket: net.Socket) => {
          socket.once("data", (data: Buffer) => {
            // Buffer incomeing data
            socket.pause();
            (async () => {
              for (const callback of this.interceptCallbacks) {
                const out = await callback(data, socket);
                if (out === true) {
                  process.nextTick(() => socket.resume());
                  return;
                }
              }
              dataHandler(data, socket);
              process.nextTick(() => socket.resume());
            })();
          });
        };
        #interceptCallbacks: ((
          request: Buffer,
          socket: net.Socket
        ) => true | void | Promise<true | void>)[] = [];
        get interceptCallbacks(): ((
          request: Buffer,
          socket: net.Socket
        ) => true | void | Promise<true | void>)[] {
          return this.#interceptCallbacks;
        }
        /**
         * Start intercepting requests
         * @param callbackFunction The callback for intercepted requests.
         */
        startIntercept(
          callbackFunction: (
            request: Buffer,
            socket: net.Socket
          ) => true | void | Promise<true | void>
        ): void {
          this.interceptCallbacks.push(callbackFunction);
          if (tcpserver.listeners("connection")[0] === connectionListener) {
            tcpserver.removeListener("connection", connectionListener);
            tcpserver.on("connection", this.#intercepter);
          }
        }
        /**
         * Stop intercepting requests
         * @param callbackFunction The callback to remove
         */
        removeIntercept(
          callbackFunction: (
            request: Buffer,
            socket: net.Socket
          ) => true | void | Promise<true | void>
        ): void {
          this.#interceptCallbacks = this.#interceptCallbacks.filter(
            (value) => value !== callbackFunction
          );
          if (
            this.#interceptCallbacks.length === 0 &&
            tcpserver.listeners("connection")[0] === this.#intercepter
          ) {
            tcpserver.removeListener(
              "connection",
              this.#intercepter as (
                this: typeof this,
                socket: net.Socket
              ) => void
            );
            tcpserver.addListener("connection", connectionListener);
          }
        }
        /**
         * Ref the server
         */
        ref(): void {
          tcpserver.ref();
        }
        /**
         * Unref the server
         */
        unref(): void {
          tcpserver.unref();
        }
        get requestIntercepter(): (socket: net.Socket) => void {
          return this.#intercepter;
        }
        get secureServer(): http.Server {
          return server;
        }
        set secureServer(value: http.Server) {
          server = value;
        }
        get insecureServer(): http.Server {
          return redirectServer;
        }
        set insecureServer(value: http.Server) {
          redirectServer = value;
        }
      })()
    )
  );
  const dataHandler = (data: Buffer, socket: net.Socket) => {
    // Detect if the provided handshake data is TLS by checking if it starts with 22, which TLS always does
    if (data[0] === 22) {
      // Https
      // You may use this socket as a TLS socket, meaning you can attach this to the same http server
      var sock = new tls.TLSSocket(socket, {
        isServer: true,
        ...options,
      });
      // Add the TLS socket as a connection to the main http server
      server.emit("connection", sock);
      // Append data to start of data buffer
      socket.unshift(data);
    } else {
      // Http
      // Emit the socket to the redirect server
      redirectServer.emit("connection", socket);
      // Http views the events, meaning I can just refire the eventEmiter
      socket.emit("data", data);
    }
  };
  const connectionListener = (socket: net.Socket) => {
    // Detect http or https/tls handskake
    socket.once("data", (data) => {
      // Buffer incomeing data
      socket.pause();
      dataHandler(data, socket);
      // Resume socket
      process.nextTick(() => socket.resume());
    });
  };
  // Handle request
  tcpserver.on("connection", connectionListener);
}
type last<array extends any[]> = array extends [...any[], infer last]
  ? last
  : never;
type allBeforeLast<array extends any[]> = array extends [...infer bl, any]
  ? bl
  : never;
const promisify = function <const value extends (...args: any) => void>(
  value: value
): (...args: allBeforeLast<Parameters<value>>) => Promise<
  Parameters<
    // @ts-ignore
    last<Parameters<value>>
  >[0]
> {
  return (...args: any[]) => new Promise((resolve) => value(...args, resolve));
};
export default promisify(listen);
