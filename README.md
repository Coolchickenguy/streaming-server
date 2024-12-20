# Streaming server
A nodejs "live" streaming server
## Features:
Creates https certs and renews them automaticy ( May be disabled during configuration. If not enabled, uses a self signed cert THAT IS INCLUDED IN THIS REPOSITORY SO IT IS NEARLY USELESS FOR SECURITY ) or serve 100% http
## How to install
Find the release you want under https://github.com/Coolchickenguy/streaming-server/releases (the first one is a good idea), download the appropiate install script (darwin for macos) youros_yourarch.sh/ps1, run it and respond to the prompts (Sometimes on windows you have to run the script with powershell -executionpolicy bypass). 
## Extra config.json propertys
resolutionsAndBitrates: [number, string, string][]
[Width (like 1080 for HD),The Video Bitrate,The Audio bitrate][]
preset: The ffmpeg preset 
"ultrafast" | "superfast" |"veryfast" |"faster" | "fast" | "medium" | "slow" | "veryslow"
