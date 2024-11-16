import fluntFfmpeg from "../ffmpeg.js";
import { join, resolve } from "path";
/**
 * Create an ffmpeg instance configured for hls
 * @param config - The configuration for the command generation
 * @param config.aspectRatio - The aspect ratio to output
 * @param config.resolutions - The resolutions to output
 * @param config.videoBitRates - The bitrates to output for the video
 * @param config.keyintMin - The min interval to output keyframes
 * @param config.audioBitRates - The bitrates to use for the audio
 * @param config.audioCodecs - The codecs to use for the audio
 * @param config.hlsTime - The length of the hls chunks
 * @param config.segmentType - The type of segment to output
 * @param config.masterPlName - The name of the master playlist
 * @param config.streamDirTemplate - The template for the stream directory
 * @param config.playlistName - The name of the local playlist
 * @param config.chunkNameTemplate - The template for the individual chunks
 * @param config.hlsListSize - How big to make the hls list before wraping
 * @param config.hlsPlaylistType - The playlist type of the hls output
 * @param config.hlsBaseUrl - The base url for the chunks
 */
export function createFfmpegHlsInst({
  // Configure ffmpeg inst
  basePath = "./",
  ffmpegOptions = [undefined, { cwd: basePath }],
  // Step 1
  fps = 30,
  aspectRatio = 16 / 9,
  resolutions = [1080, 720, 360],
  customFilter = "",
  // Step 2
  videoBitRates = ["5M", "3M", "1M"],
  keyintMin = [48, 48, 48],
  audioBitRates = ["96K", "96K", "48K"],
  audioCodecs = ["aac", "aac", "aac"],
  useVideoTrack = 0,
  useAudioTrack = 0,
  // Step 3
  hlsTime = 5,
  segmentType = "mpegts",
  masterPlName = "masterPl.m3u8",
  streamDirTemplate = "stream_%v",
  playlistName = "playlist.m3u8",
  chunkNameTemplate = "chunk%04d.ts",
  hlsListSize = undefined,
  hlsPlaylistType = undefined,
  hlsBaseUrl = undefined,
}: Partial<{
  // Configure ffmpeg inst
  ffmpegOptions: Parameters<typeof fluntFfmpeg>;
  basePath: string;
  // Step 1
  fps: number;
  aspectRatio: number;
  resolutions: number[];
  customFilter: string;
  // Step 2
  videoBitRates: string[];
  keyintMin: number[];
  audioBitRates: string[];
  audioCodecs: string[];
  useVideoTrack: number;
  useAudioTrack: number;
  // Step 3
  hlsTime: number;
  segmentType: string;
  masterPlName: string;
  streamDirTemplate: string;
  playlistName: string;
  chunkNameTemplate: string;
  hlsListSize: number;
  hlsPlaylistType: string;
  hlsBaseUrl: string;
}>) {
  return (
    fluntFfmpeg(...ffmpegOptions)
      .outputFormat("hls")
      // Create multable resolutions
      .addOutputOptions(
        ...(useVideoTrack >= 0
          ? [
              "-filter_complex",
              `[${useVideoTrack}:v]fps=${fps}[filtered]; [filtered]${customFilter}:[cfv]; [cfv]split=${
                resolutions.length
              }${resolutions
                .map((_r, index) => `[v${index + 1}]`)
                .join("")}; ${resolutions
                .map(
                  (resolution, index) =>
                    `[v${index + 1}]scale=w=${
                      Math.ceil((resolution * aspectRatio) / 2) * 2
                    }:h=${resolution}[v${index + 1}out]`
                )
                .join("; ")}`,
            ]
          : [])
      )
      .addOutputOptions(
        ...(useVideoTrack >= 0
          ? videoBitRates.map((bitrate, index) => [
              "-map",
              `[v${index + 1}out]`,
              /*"-c:v:1",
            "libx264",*/
              "-x264-params",
              "nal-hrd=cbr:force-cfr=1",
              `-b:v:${index}`,
              bitrate,
              "-maxrate:v:1",
              bitrate,
              "-minrate:v:1",
              bitrate,
              "-bufsize:v:1",
              bitrate,
              "-preset",
              "slow",
              "-g",
              "48",
              "-sc_threshold",
              "0",
              "-keyint_min",
              keyintMin[index].toString(),
              /*"-f",
            "mpegts"*/
            ])
          : []
        ).flat(1),
        ...(useAudioTrack >= 0
          ? audioBitRates.map((bitrate, index) => [
              "-map",
              `a:${useAudioTrack}`,
              `-c:a:${index}`,
              audioCodecs[index],
              `-b:a:${index}`,
              bitrate,
              "-ac",
              "2",
            ])
          : []
        ).flat(1)
      )
      // Hls format stuff
      .addOutputOptions(
        "-hls_time",
        hlsTime.toString(),
        "-hls_flags",
        "independent_segments",
        "-hls_segment_type",
        segmentType,
        "-hls_segment_filename",
        join(streamDirTemplate, chunkNameTemplate),
        "-var_stream_map",
        resolutions
          .map((_value, index) =>
            [
              ...(useVideoTrack >= 0 ? [`v:${index}`] : []),
              ...(useAudioTrack >= 0 ? [`a:${index}`] : []),
            ].join(",")
          )
          .join(" "),
        "-master_pl_name",
        masterPlName,
        ...(typeof hlsListSize !== "undefined"
          ? ["-hls_list_size", hlsListSize.toString()]
          : []),
        ...(hlsPlaylistType ? ["-hls_playlist_type", hlsPlaylistType] : []),
        ...(hlsBaseUrl ? ["-hls_base_url", hlsBaseUrl] : [])
      )
      .addOutput(join(streamDirTemplate, playlistName))
  );
}
