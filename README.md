# Streaming server
A nodejs "live" streaming server
## Features:
Creates https certs and renews them automaticy ( May be disabled during configuration. If not enabled, uses a self signed cert THAT IS INCLUDED IN THIS REPOSITORY SO IT IS NEARLY USELESS FOR SECURITY ) or serve 100% http
## How to start
(You must have npm and nodejs installed).
run ```npm i``` to install the deps then run ```npm run build``` to build the server ( Run this whenever you make changes to the src folder. NEVER EDIT THE DIST FORLDER UNLESS YOU LOVE YOUR CHANGES BEING DELETED WHENEVER SOMEONE REBUILDS). To setup the server, run ```npm run setup``` and answer the prompts. To finaly start the server, run ```npm start```. This will start the server and will try to host to ports 443 and 80. If those are in use, the server will crash with ```Error: listen EADDRINUSE: address already in use```. If any other error appers and you are on a unix-y system, try to rerun with sudo.
