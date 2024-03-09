// server initialization here so that server variable can
// be imported anywhere in the app
// this is useful for using in game

const express = require('express');
const http = require('http');
const {Server} = require("socket.io");

// initialize express server
const app = express();

// initialize normal http server
const server = http.createServer(app);

// initialize socket io server (web socket)
const io = new Server(server);

module.exports = {server, io, app}