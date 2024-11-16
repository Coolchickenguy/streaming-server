// My own, simple router
import { exsists } from "./types.js";
import { isEmpty } from "./utils.js";
const wildcard = Symbol("wildcard");
type exsampleRouter = routerInstance<{
  use: { satisfiyes: ["get", "post"] };
  get: {};
  post: {};
}>;
type route = {
  precedence: number;
  name: string;
};
type routePathNormal = {
  [key: string]: { routes: route[]; children: routePath };
};
type routePathWildcard = {
  [key in typeof wildcard]?: routePathNormal[string];
};
type routePath = routePathNormal & routePathWildcard;
type routes = {
  [key: string]: {
    satisfiyedBy: string[];
    paths: routePath;
  };
};
type routeTypesDescriptor = {
  [key: string]: { satisfiyes?: string[] };
};
type getRouteTypes<rt> = [
  | keyof rt
  | Extract<
      rt[keyof rt],
      { satisfiyes: readonly string[] | string[] }
    >[][number]["satisfiyes"][number]
][number];
type routerInstance<rt = routeTypesDescriptor> = {
  /**
   * The internal route structure of the router
   * @private
   */
  _routes: routes;
  /**
   * The next precedence to use
   * @private
   */
  _precedenceIndex: number;
  /**
   * Pare path into array
   * @param path The path to parse
   */
  _parsePath(path: string): string[];
  /* 
  /**
   * If the router has been modifyid since the last build.
   * @private
   */
  _modifyed: boolean;
  /**
   * Build the router object. This is by defaut automaticly called when the object is used and there has been a change.
   */
  build(): void;
  /**
   *
   * @param path A path to get the routes for.
   * @param type The path type.
   */
  getRoutes(path: string, type: getRouteTypes<rt>): any[];
  routes: {
    [key in getRouteTypes<rt>]: exsists<rt, key, {}> & {
      /**
       * The paths of the route type. The first value is the parth and the second is the value to pass back after the route being chosen by the router.
       */
      paths: [string, any][];
    };
  };
};
interface router {
  /**
   * Create a request router.
   * @param routeTypes The route type descriptor. Defaults to
   * {
   * use: { satisfiyes: ["get", "post"] },
   * get: {},
   * post: {},
   * }
   * @param autoBuild Rebuild the router before useing a matcher if it has been modifyed. May not be changed after creation. Defaults to true.
   */
  new <const rt extends routeTypesDescriptor = routeTypesDescriptor>(
    routeTypes?: rt,
    autoBuild?: boolean
  ): routerInstance<rt>;
  /**
   * Create a request router.
   * @param routeTypes The route type descriptor. Defaults to
   * {
   * use: { satisfiyes: ["get", "post"] },
   * get: {},
   * post: {},
   * }
   * @param autoBuild Rebuild the router before useing a matcher if it has been modifyed. May not be changed after creation. Defaults to true.
   */
  <
    const rt extends routeTypesDescriptor = {
      use: { satisfiyes: ["get", "post"] };
      get: {};
      post: {};
    }
  >(
    routeTypes?: rt,
    autoBuild?: boolean
  ): routerInstance<rt>;
}
export const router = function requestRouter(
  this: typeof requestRouter.prototype | undefined,
  routeTypes: routeTypesDescriptor = {
    use: { satisfiyes: ["get", "post"] },
    get: {},
    post: {},
  },
  autoBuild: boolean = true
): void | router["prototype"] {
  if (!(this instanceof router)) {
    return new router(routeTypes, autoBuild);
  }
  var changeModifyed = (nv: boolean) => (this._modifyed = nv);
  // @ts-ignore
  this.routes = Object.fromEntries(
    [
      ...new Set(
        Object.entries(routeTypes)
          .map(([key, value = {}]) => [key, value.satisfiyes || []])
          .flat(2)
      ),
    ].map((val) => [
      val,
      {
        paths: autoBuild
          ? new Proxy([] as string[], {
              set(target, p, newValue) {
                target[p as unknown as number] = newValue;
                changeModifyed(true);
                return true;
              },
            })
          : [],
        ...(val in routeTypes && "satisfiyes" in routeTypes[val]
          ? // @ts-ignore
            { satisfiyes: routeTypes[val].satisfiyes }
          : {}),
      },
    ])
  );
} as any as router;
router.prototype._routes = {};
router.prototype._parsePath = function (path: string) {
  return (path.replace(/\/$/m, "") || "/").split("/");
};
router.prototype._precedenceIndex = 0;
// Avoid lag by converting routes into more easly prossesable form.
router.prototype.build = function (this: exsampleRouter): void {
  var entries = Object.entries(
    Object.entries(this.routes).reduce(
      (last, [key, value]) => {
        if ("satisfiyes" in value) {
          value.satisfiyes.forEach((val) =>
            "satisfiyedBy" in last[val]
              ? last[val].satisfiyedBy?.push(key)
              : (last[val].satisfiyedBy = [key])
          );
        }
        if (!("satisfiyedBy" in last[key])) {
          last[key].satisfiyedBy = [];
        }
        return last;
      },
      this.routes as {
        [key in string]: {
          satisfiyes?: string[];
          satisfiyedBy?: string[];
          paths: [string, any][];
        };
      }
    )
  );
  this._routes = Object.fromEntries(
    entries.map(([key, value]) => {
      var out: routePath = {};
      value.paths.forEach((val) => {
        const parsed = this._parsePath(
          val[0].replace(/(?<=\/)\*$/, ":asterisk")
        );
        //console.log(parsed);
        var outRef: any = out;
        parsed.forEach((parsedString: string | typeof wildcard, i) => {
          if ((parsedString as string).startsWith(":")) {
            parsedString = wildcard;
          }
          if (!(parsedString in outRef)) {
            outRef[parsedString] = { routes: [], children: {} };
          }
          //console.log(outRef);
          if (i < parsed.length - 1) {
            outRef = outRef[parsedString].children;
          } else {
            outRef = outRef[parsedString];
          }
        });
        // console.log(outRef);
        outRef.routes.push({
          precedence: this._precedenceIndex++,
          name: val[1],
        });
      });
      this._modifyed = false;
      return [
        key,
        {
          paths: out,
          ...("satisfiyedBy" in value
            ? { satisfiyedBy: value.satisfiyedBy }
            : { satisfiyedBy: [] }),
        },
      ] as [typeof key, { paths: typeof out; satisfiyedBy: string[] }];
    })
  );
};
function routeGeter(parsed: string[], route: routePath[string]): route[] {
  let output: route[][] = [];
  for (let i = 0; i < parsed.length && route !== undefined; i++) {
    output.push(route.routes);
    if (wildcard in route.children) {
      output.push(
        routeGeter(
          parsed.slice(i + 1),
          route.children[wildcard] as routePathNormal[string]
        )
      );
    }
    route = route.children[parsed[i]];
  }
  output.push(route?.routes ?? []);
  return output.flat(1);
}

router.prototype.getRoutes = function (
  this: exsampleRouter,
  path: string,
  type: string
): any[] {
  var parsed = this._parsePath(path);
  if (this._modifyed) {
    this.build();
  }
  var routeNames = [type, ...this._routes[type].satisfiyedBy];
  return routeNames
    .reduce((lastVal, routeName) => {
      var route = this._routes[routeName].paths;
      if (isEmpty(route)) {
        return lastVal;
      }
      lastVal.push(...routeGeter(parsed, { children: route, routes: [] }));
      return lastVal;
    }, [] as route[])
    .sort((a, b) => (a.precedence > b.precedence ? 1 : -1))
    .map((val) => val.name);
};
router.prototype._modifyed = true;
/*
var routerDemo = new router({
  use: { satisfiyes: ["get", "post"] },
  get: {},
  post: {},
});
//console.log(routerDemo.routes);
//routerDemo.routes.use.paths.push("/chicken/index.html");
routerDemo.routes.use.paths.push([
  "/chicken/bocks/no",
  "The no chicken bocks path!! Must include",
]);
routerDemo.routes.use.paths.push([
  "/chicken/bocks/no/brook.html",
  "The brook html file. Must include.",
]);
routerDemo.routes.use.paths.push([
  "/chicken/bocks",
  "chicken bocks root of use. Must include.",
]);
routerDemo.routes.get.paths.push([
  "/chicken/bocks",
  "the chicken bocks root of get. Must include.",
]);
routerDemo.routes.get.paths.push([
  "/:chickenrelated/bocks/no/:file",
  "A wildcard. Must include.",
]);
routerDemo.routes.get.paths.push(["/chicken/:bocks/no/:file", "A wildcard2. Must include."]);
routerDemo.routes.get.paths.push(["/hi", "A unused GET path. Must not include."]);
routerDemo.routes.get.paths.push(["/hi/:any", "A unused GET path with wildcards. Must not include."]);
routerDemo.routes.get.paths.push([
  "/chicken/bocks/no/*",
  "A end wildcard that is TRUE. Must include.",
]);
routerDemo.routes.get.paths.push([
  "/chicken/bocks/no/brook.html/*",
  "A end wildcard that is FALSE. Must NOT include.",
]);
routerDemo.routes.get.paths.push(["/", "root"]);
routerDemo.build();
//console.log(routerDemo._routes.get.paths,"wildcard");
console.log(routerDemo.getRoutes("/chicken/bocks/no/brook.html", "get"));
console.log(JSON.stringify(routerDemo._routes));
*/
