import { root, getConfig } from "../../../../config.js";
import { ffprobeLocation } from "../../../../ffmpeg.js";
import { createFfmpegHlsInst } from "../../../hls.js";
import { init } from "../common/dbv1.js";
import { mkdirSync, rmSync } from "fs";
import { Readable } from "stream";
import { spawn } from "child_process";
import { resolve } from "path";
import { teeStream, closestNumber, events } from "../../../utils.js";
import { symlinkSync, existsSync, unlinkSync } from "fs";
import { error400 } from "./index.js";
type db = ReturnType<typeof init>;
const { resolutionsAndBitrates: ___resolutionsAndBitrates } = getConfig();
const resolutionsAndBitrates: [number, string, string][] = Array.isArray(
  ___resolutionsAndBitrates
)
  ? ___resolutionsAndBitrates
  : // 8k,4k,2k,hd,720p,480p,360p
    [
      /*[4320, "120M", "256K"],
      [2160, "40M", "256K"],
      [1440, "16M", "256K"],*/
      [1080, "10M", "256K"],
      [720, "6M", "128K"],
      [480, "4M", "128K"],
      [360, "3M", "64K"],
    ];
export async function initHls(
  database: db,
  token: string,
  videoFormat: string,
  inputStream: Readable
): Promise<
  | { error: "token"; code: 1 | 2 | 3 | 4 }
  // Code 1: in use
  | { error: "account"; code: 1 }
  | { error: "ffprobe"; data: string }
  | { error: "ffmpeg"; ffmpegError: string; ffmpegStderr: string }
  | void
> {
  const tokenHash = database._hashToken(token);
  const tokenVailidity = database.validateToken(tokenHash);
  if (tokenVailidity !== 0) {
    return { error: "token", code: tokenVailidity };
  }
  if (
    !(
      database.getMedia(
        database._database.tokens[tokenHash].username,
        "public",
        ["premissions", "abilities"]
      ) as any
    ).brodcast === true
  ) {
    return { error: "token", code: 4 };
  }
  const { username } = database._database.tokens[tokenHash];
  const __streams = database.getMedia(username, "public", ["streams"]) ?? [];
  if (__streams[__streams.length]?.active === true) {
    return { error: "account", code: 1 };
  }
  const probeStream = new Readable({ read() {} });
  const videoStream = new Readable({ read() {} });
  teeStream(inputStream, [probeStream, videoStream]);
  const probe = spawn(ffprobeLocation, [
    "-v",
    "error",
    /*"-select_streams",
    "v:0",*/
    "-show_entries",
    "stream=width,height",
    "-of",
    "json",
    "-f",
    videoFormat,
    "pipe:0",
  ]);
  probeStream.pipe(probe.stdin);
  const stdout: string[] = [];
  const stderr: string[] = [];
  probe.stdout.on("data", (data) => stdout.push(data));
  probe.stderr.on("data", (data) => stderr.push(data));
  await new Promise((resolve) => probe.once("exit", resolve));
  const output = (
    stderr.length !== 0
      ? { type: "fail", data: stderr.join("") }
      : { type: "success", data: JSON.parse(stdout.join("")) }
  ) as
    | {
        type: "success";
        data: {
          programs: [];
          streams: (
            | {
                width: number;
                height: number;
              }
            | {}
          )[];
        };
      }
    | { type: "fail"; data: string };
  if (output.type === "fail") {
    return { error: "ffprobe", data: output.data };
  }
  // Clean up probe
  probeStream.destroy();
  const probeData = output.data;
  const { width, height } = [
    ...probeData.streams.filter(
      (stream) => "width" in stream && "height" in stream
    ),
    { width: -1, height: -1 },
  ][0];
  const aspectRatio = 16 / 9;
  const startDate = Date.now();
  const oldStreams: {
    startDate: number;
    active: boolean;
    deleted: boolean;
  }[] = database.getMedia(username, "public", ["streams"]) ?? [];
  oldStreams.push({ startDate, active: true, deleted: false });
  database.setMedia(username, "public", oldStreams, ["streams"]);
  const streamIndex = oldStreams.length;
  const streamDir = resolve(
    root,
    "assets",
    "private",
    "userMedia",
    "streams",
    username,
    streamIndex.toString()
  );
  mkdirSync(streamDir, { recursive: true });
  const latestDir = resolve(streamDir, "../latest");
  if (existsSync(latestDir)) {
    unlinkSync(latestDir);
  }
  symlinkSync(streamDir, latestDir);
  const newHeight = closestNumber(
    height,
    resolutionsAndBitrates.map(([resolution]) => resolution)
  );
  const newWidth = Math.ceil(newHeight * aspectRatio);
  const useableResolutionsAndBitrates = resolutionsAndBitrates.filter(
    ([resolution, videoBitrate, audioBitrate]) => newHeight >= resolution
  );
  const config = {
    customFilter: `scale=iw*min(${newWidth}/iw\\,${newHeight}/ih):ih*min(${newWidth}/iw\\,${newHeight}/ih),pad=${newWidth}:${newHeight}:(${newWidth}-iw)/2:(${newHeight}-ih)/2`,
    aspectRatio,
    resolutions: useableResolutionsAndBitrates.map(
      ([resolution, videoBitrate, audioBitrate]) => resolution
    ),
    videoBitRates: useableResolutionsAndBitrates.map(
      ([resolution, videoBitrate, audioBitrate]) => videoBitrate
    ),
    audioBitRates: useableResolutionsAndBitrates.map(
      ([resolution, videoBitrate, audioBitrate]) => audioBitrate
    ),
    basePath: streamDir,
    useAudioTrack:
      probeData.streams.filter(
        (value) => !("width" in value || "height" in value)
      ).length !== 0
        ? 0
        : -1,
    useVideoTrack: width >= 0 ? 0 : -1,
    hlsListSize: 0,
  };
  const ffmpegInst = createFfmpegHlsInst(config);
  ffmpegInst.addInput(videoStream);
  ffmpegInst.inputFormat(videoFormat);
  return await new Promise(function host(resolve) {
    function onEnd() {
      const old = database.getMedia(username, "public", ["streams"]);
      if (old[streamIndex - 1]) {
        old[streamIndex - 1].active = false;
        database.setMedia(username, "public", old, ["streams"]);
      }
      resolve();
      events.removeListener("exit", onEnd);
    }
    ffmpegInst.on("error", function (error, stdout, stderr) {
      resolve({
        error: "ffmpeg",
        ffmpegError: error.message,
        ffmpegStderr: stderr ?? "",
      });
      onEnd();
    });
    videoStream.once("end", onEnd);
    videoStream.once("close", onEnd);
    // Prepend so it will be run before the db is destroyed
    events.prependListener("exit", onEnd);
    ffmpegInst.run();
  });
}
