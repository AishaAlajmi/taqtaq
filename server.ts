import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Room state management
  const rooms = new Map<string, any>();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("create_room", (data, callback) => {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      rooms.set(roomId, {
        id: roomId,
        hostId: socket.id,
        state: data.initialState || {},
        buzzerWinner: null,
        buzzerLocked: true,
        players: {}
      });
      socket.join(roomId);
      console.log(`Room created: ${roomId} by ${socket.id}`);
      callback({ roomId });
    });

    socket.on("join_room", (data, callback) => {
      const { roomId, teamId } = data;
      const room = rooms.get(roomId);
      
      if (!room) {
        return callback({ error: "Room not found" });
      }

      socket.join(roomId);
      room.players[socket.id] = { teamId };
      
      console.log(`User ${socket.id} joined room ${roomId} as team ${teamId}`);
      
      // Send current state to the new player
      callback({ 
        success: true, 
        state: room.state,
        buzzerWinner: room.buzzerWinner,
        buzzerLocked: room.buzzerLocked
      });

      // Notify others
      socket.to(roomId).emit("player_joined", { socketId: socket.id, teamId });
    });

    socket.on("game_state_update", (data) => {
      const { roomId, state } = data;
      const room = rooms.get(roomId);
      if (room && room.hostId === socket.id) {
        room.state = state;
        socket.to(roomId).emit("game_state_updated", state);
      }
    });

    socket.on("buzz_press", (data) => {
      const { roomId, teamId } = data;
      const room = rooms.get(roomId);
      
      if (room && !room.buzzerLocked && !room.buzzerWinner) {
        room.buzzerWinner = teamId;
        room.buzzerLocked = true;
        
        // Broadcast to everyone in the room
        io.to(roomId).emit("buzzer_pressed", { teamId });
      }
    });

    socket.on("buzz_lock", (data) => {
      const { roomId, locked } = data;
      const room = rooms.get(roomId);
      if (room && room.hostId === socket.id) {
        room.buzzerLocked = locked;
        if (!locked) {
          room.buzzerWinner = null;
        }
        io.to(roomId).emit("buzzer_locked", { locked });
      }
    });

    socket.on("buzz_reset", (data) => {
      const { roomId } = data;
      const room = rooms.get(roomId);
      if (room && room.hostId === socket.id) {
        room.buzzerWinner = null;
        room.buzzerLocked = false;
        io.to(roomId).emit("buzzer_reset");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // Clean up rooms if host disconnects or player leaves
      rooms.forEach((room, roomId) => {
        if (room.hostId === socket.id) {
          // Host disconnected, maybe destroy room or pause
          io.to(roomId).emit("host_disconnected");
          // rooms.delete(roomId); // Keep it for a bit to allow reconnect?
        } else if (room.players[socket.id]) {
          delete room.players[socket.id];
          io.to(roomId).emit("player_left", { socketId: socket.id });
        }
      });
    });
  });

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("index.html", { root: "dist" });
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
