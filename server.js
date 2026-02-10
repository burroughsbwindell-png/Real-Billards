// Real Billiards Server - Copyright 2025 Windell
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const rooms = new Map();
const players = new Map();

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);
    
    socket.on('register', (data) => {
        const player = {
            id: socket.id,
            username: data.username || `Player_${socket.id.substr(0, 6)}`,
            balance: 100,
            inventory: ['house'],
            activeCue: 'house'
        };
        players.set(socket.id, player);
        socket.emit('registered', { player });
    });
    
    socket.on('findMatch', (data) => {
        const roomId = uuidv4().substr(0, 8);
        const room = {
            id: roomId,
            tier: data
