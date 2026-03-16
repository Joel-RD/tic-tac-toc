import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Servir archivos estáticos de la carpeta dist de Vite
app.use(express.static(path.join(__dirname, '../dist')));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? false // En producción usamos el mismo dominio
      : "http://localhost:5173", // URL de desarrollo de Vite
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('get_rooms', () => {
    socket.emit('rooms_list', Array.from(rooms.values()));
  });

  socket.on('create_room', (roomName) => {
    const roomId = Math.random().toString(36).substring(7);
    const room = {
      id: roomId,
      name: roomName,
      players: [{ id: socket.id, name: 'Jugador 1', symbol: 'X' }],
      board: Array(9).fill(null),
      turn: 'X',
      status: 'waiting'
    };
    rooms.set(roomId, room);
    socket.join(roomId);
    socket.emit('room_created', room);
    io.emit('rooms_list', Array.from(rooms.values()));
  });

  socket.on('join_room', (roomId) => {
    const room = rooms.get(roomId);
    if (room && room.players.length < 2) {
      room.players.push({ id: socket.id, name: 'Jugador 2', symbol: 'O' });
      room.status = 'playing';
      socket.join(roomId);
      socket.emit('joined_room', room);
      io.to(roomId).emit('game_start', room);
      io.emit('rooms_list', Array.from(rooms.values()));
    } else {
      socket.emit('error', 'Room is full or doesn\'t exist');
    }
  });

  socket.on('make_move', ({ roomId, index, symbol }) => {
    const room = rooms.get(roomId);
    if (room && room.status === 'playing' && room.turn === symbol) {
      room.board[index] = symbol;
      room.turn = symbol === 'X' ? 'O' : 'X';
      io.to(roomId).emit('move_made', { board: room.board, turn: room.turn });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Manejar limpieza de salas si un jugador se desconecta
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        io.to(roomId).emit('player_disconnected');
        rooms.delete(roomId);
        io.emit('rooms_list', Array.from(rooms.values()));
        break;
      }
    }
  });
});

// Manejar cualquier otra ruta entregando el index.html de React
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
