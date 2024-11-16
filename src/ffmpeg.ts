import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import fluentFfmpeg from "fluent-ffmpeg";
fluentFfmpeg.setFfmpegPath(ffmpegPath);
fluentFfmpeg.setFfprobePath(ffprobePath);
export default fluentFfmpeg;
export const ffprobeLocation = ffprobePath;
export const ffmpegLocation = ffmpegPath;
