/**
 * Get the url to download nodejs from (Precompiled binary)
 * @param {`v${string}.${string}.${string}`} version
 * @param {"win" | "darwin" | "linux"} platform
 * @param {"x64" | "armv7l" | "arm64" | "ppc64le" | "s390x" | "x86"} arch
 */
function getNodejsDownloadUrl(version, platform, arch) {
  return `https://nodejs.org/dist/${version}/node-${version}-${platform}-${arch}.${
    platform === "win" ? "zip" : "tar.gz"
  }`;
}
const [buildV, buildPlatform, buildArch, codeVersion] = process.argv.slice(2);
const downloadUrl = getNodejsDownloadUrl(buildV, buildPlatform, buildArch);
//console.log(`Createing instaler for downloading nodejs version ${buildV} for platform ${buildPlatform} with arch ${buildArch}. Generated download url ${downloadUrl}`);
if (buildPlatform === "win") {
  const pwsh = `$nodeUrl = "${downloadUrl}"
$releaseUrl = "https://github.com/Coolchickenguy/streaming-server/archive/refs/tags/${codeVersion}.zip"
$dir = Read-Host -Prompt "Enter install dir"
New-Item -Path $dir -ItemType Directory -ErrorAction SilentlyContinue -Force
Set-Location $dir
New-Item -Path temp -ItemType Directory
Invoke-WebRequest $nodeUrl -OutFile ./temp/nodejs.zip
New-Item -Path ./nodejs -ItemType Directory
Expand-Archive ./temp/nodejs.zip -DestinationPath ./nodejs
Move-Item -Path "./nodejs/*/*" -Destination "./nodejs"
Remove-Item ./temp/nodejs.zip
Invoke-WebRequest $releaseUrl -OutFile ./temp/release.zip
New-Item -Path release -ItemType Directory
Expand-Archive ./temp/release.zip -DestinationPath ./release
Move-Item -Path "./release/*/*" -Destination "./release"
Remove-Item ./temp/release.zip
Set-Location ./release
$env:Path = "$(Resolve-Path ../nodejs);$($env:Path)"
npm i
npm run build
npm run setup
'${`Set-Location ./release
$env:Path = "$(Resolve-Path ../nodejs);$($env:Path)"
npm run start`}' | Out-File -FilePath ../start.ps1`;
  console.log(pwsh);
} else if (buildPlatform === "darwin" || buildPlatform === "linux") {
  const sh = `nodeUrl=${downloadUrl}
releaseUrl=https://github.com/Coolchickenguy/streaming-server/archive/refs/tags/${codeVersion}.tar.gz
read -p "Enter install dir" dir
mkdir -p $dir
cd $dir
mkdir temp
curl -o ./temp/nodejs.tar.gz $nodeUrl
mkdir nodejs
tar -xzf ./temp/nodejs.tar.gz -C nodejs
mv ./nodejs/*/* ./nodejs
rm ./temp/nodejs.tar.gz
curl -L -o ./temp/release.tar.gz $releaseUrl
mkdir release
tar -xzf ./temp/release.tar.gz -C release
mv ./release/*/* ./release
rm ./temp/release.tar.gz
rm -r ./temp
cd release
../nodejs/bin/npm i
../nodejs/bin/npm run build
../nodejs/bin/npm run setup
cd ../
printf "cd ./release\\n ../nodejs/bin/npm run start" > ./start.sh`;
  console.log(sh);
} else {
  console.log("Invalid os");
  process.exitCode = 1;
}
