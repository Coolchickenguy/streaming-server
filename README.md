# ws-express-auto-https-cert-nodejs-template
A template for nodejs webservers dealing with websockets.
## Features:
Creates https certs and renews them automaticy ( May be disabled during configuration. If not enabled, uses a self signed cert THAT IS INCLUDED IN THIS REPOSITORY SO IT IS NEARLY USELESS FOR SECURITY )
## How to start
(You must have npm and nodejs installed).
run ```npm i``` to install the deps then run ```npm run build``` to build the server ( Run this whenever you make changes to the src folder. NEVER EDIT THE DIST FORLDER UNLESS YOU LOVE YOUR CHANGES BEING DELETED WHENEVER SOMEONE REBUILDS). To setup the server, run ```npm run setup``` and answer the prompts. To finaly start the server, run ```npm start```. This will start the server and will try to host to ports 443 and 80. If those are in use, the server will crash with ```Error: listen EADDRINUSE: address already in use```. If any other error appers and you are on a unix-y system, try to rerun with sudo.
## What it hosts out of the box
### Https
If you go to the root path, it send hello. Anywere else it will send a internet-explorer style 404 page.
### Http
Redirects to https at the same path
### Ws
No servers, but the server is capable of it with ws.ws insted of ws.wss
### Wss
At path /api/v1/websocket/echo, it will echo all data sent