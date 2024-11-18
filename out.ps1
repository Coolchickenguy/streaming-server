# Run with powershell -executionpolicy bypass
$nodeUrl = "https://nodejs.org/dist/v22.11.0/node-v22.11.0-win-x64.zip"
$releaseUrl = "https://github.com/Coolchickenguy/streaming-server/archive/refs/tags/1.0.0.zip"
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
'Set-Location ./release
$env:Path = "$(Resolve-Path ../nodejs);$($env:Path)"
npm run start' | Out-File -FilePath ../start.ps1
