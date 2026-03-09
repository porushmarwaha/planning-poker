import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    rooms: rooms.size,
    timestamp: new Date().toISOString()
  });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// In-memory game state
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create-room', ({ roomId, roomName, deck, allowSpectators, autoReveal }) => {
    const room = {
      id: roomId,
      name: roomName,
      deck: deck,
      host: socket.id,
      players: [],
      issues: [],
      currentIssueId: null,
      status: 'idle',
      allowSpectators,
      autoReveal
    };
    rooms.set(roomId, room);
    socket.join(roomId);
    socket.emit('room-created', room);
  });

  socket.on('join-room', ({ roomId, playerName, isSpectator }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('room-error', { message: 'Room not found' });
      return;
    }

    const player = {
      id: socket.id,
      name: playerName,
      isSpectator: isSpectator || false,
      currentVote: null
    };

    room.players.push(player);
    socket.join(roomId);
    
    io.to(roomId).emit('room-update', room);
    socket.emit('joined-room', room);
  });

  socket.on('add-issue', ({ roomId, issue }) => {
    const room = rooms.get(roomId);
    if (room && socket.id === room.host) {
      room.issues.push(issue);
      io.to(roomId).emit('room-update', room);
    }
  });

  socket.on('update-issues', ({ roomId, issues }) => {
    const room = rooms.get(roomId);
    if (room && socket.id === room.host) {
      room.issues = issues;
      io.to(roomId).emit('room-update', room);
    }
  });

  socket.on('start-voting', ({ roomId, issueId }) => {
    const room = rooms.get(roomId);
    if (room && socket.id === room.host) {
      room.currentIssueId = issueId;
      room.status = 'voting';
      
      // Reset all votes
      room.players.forEach(p => p.currentVote = null);
      const issue = room.issues.find(i => i.id === issueId);
      if (issue) {
        issue.status = 'voting';
        issue.votes = {};
      }
      
      io.to(roomId).emit('room-update', room);
    }
  });

  socket.on('cast-vote', ({ roomId, vote }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player && !player.isSpectator) {
      player.currentVote = vote;
      
      const issue = room.issues.find(i => i.id === room.currentIssueId);
      if (issue) {
        issue.votes = issue.votes || {};
        issue.votes[socket.id] = vote;
      }

      // Check if all non-spectator players have voted for auto-reveal
      if (room.autoReveal) {
        const nonSpectators = room.players.filter(p => !p.isSpectator);
        const allVoted = nonSpectators.every(p => p.currentVote !== null);
        if (allVoted) {
          room.status = 'revealed';
        }
      }

      io.to(roomId).emit('room-update', room);
    }
  });

  socket.on('reveal-votes', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (room && socket.id === room.host) {
      room.status = 'revealed';
      io.to(roomId).emit('room-update', room);
    }
  });

  socket.on('new-round', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (room && socket.id === room.host) {
      room.status = 'voting';
      room.players.forEach(p => p.currentVote = null);
      
      const issue = room.issues.find(i => i.id === room.currentIssueId);
      if (issue) {
        issue.votes = {};
      }
      
      io.to(roomId).emit('room-update', room);
    }
  });

  socket.on('set-estimate', ({ roomId, issueId, estimate }) => {
    const room = rooms.get(roomId);
    if (room && socket.id === room.host) {
      const issue = room.issues.find(i => i.id === issueId);
      if (issue) {
        issue.estimate = estimate;
        issue.status = 'estimated';
      }
      io.to(roomId).emit('room-update', room);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove player from all rooms
    rooms.forEach((room, roomId) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        io.to(roomId).emit('room-update', room);
      }
      
      // Clean up empty rooms
      if (room.players.length === 0) {
        rooms.delete(roomId);
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Planning Poker server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
