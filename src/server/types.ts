import https from "https";
import http from "http";
export type routeTypes = "post" | "get" | "use";
export type exsists<V, Key extends string | number | symbol,fallback extends any> = ({[key in keyof V]:V[key]} & {[key in any]:fallback})[Key];
export interface request extends http.IncomingMessage {};
export interface responce extends http.ServerResponse {};