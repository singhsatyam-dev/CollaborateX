import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import connectDB from "./src/database/db.js";
import app from "./src/app.js";
import initializeSocket from "./src/sockets/socket.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

initializeSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
