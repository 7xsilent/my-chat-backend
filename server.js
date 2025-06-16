const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express app instance
const app = express();
// Create an HTTP server using the Express app
const server = http.createServer(app);
// Initialize Socket.IO with the HTTP server
const io = socketIo(server, {
  cors: {
    // This allows your React app (even if running on a different port) to connect.
    // For development, '*' is fine, but in production, you'd specify your React app's domain.
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Define the port your server will listen on
// Process.env.PORT is for hosting environments, 4000 is our default
const PORT = process.env.PORT || 4000;

// Listen for new WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id); // Log when someone connects

  // Listen for a 'sendMessage' event from any connected client
  socket.on('sendMessage', (message) => {
    console.log('Message received:', message); // Log the received message
    // Broadcast the 'receiveMessage' event to ALL connected clients (including the sender)
    io.emit('receiveMessage', message);
  });

  // Listen for when a client disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id); // Log when someone disconnects
  });
});

// Start the HTTP server listening on the defined PORT
server.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
});
