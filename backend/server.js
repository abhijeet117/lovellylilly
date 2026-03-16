const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

// Load environment variables
dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const socketService = require("./src/services/socket.service");

// Connect to database
connectDB();

// Create HTTP server
const httpServer = http.createServer(app);

// Attach Socket.io to HTTP server
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    }
});

// Register Socket.io events via socket service
socketService.init(io);

const PORT = process.env.PORT || 5000;
const server = httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
