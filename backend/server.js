const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const { execFileSync, execSync } = require("child_process");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

// Load environment variables
dotenv.config();

// Validate required environment variables before anything else
const validateEnv = require("./src/config/validateEnv");
validateEnv();

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

const detectPortOwner = (port) => {
    try {
        if (process.platform === "win32") {
            const lookupCmd = `$conn = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq ${port} } | Select-Object -First 1 OwningProcess; if ($conn) { $proc = Get-CimInstance Win32_Process -Filter "ProcessId = $($conn.OwningProcess)" | Select-Object ProcessId, CommandLine; if ($proc) { Write-Output "$($proc.ProcessId)|$($proc.CommandLine)" } }`;
            const raw = execFileSync("powershell", ["-NoProfile", "-Command", lookupCmd], {
                stdio: ["ignore", "pipe", "ignore"],
                encoding: "utf8"
            }).trim();
            if (!raw) return null;
            const [pid, ...cmdParts] = raw.split("|");
            return { pid: pid || "unknown", command: cmdParts.join("|").trim() || "unknown command" };
        }

        const raw = execSync(`lsof -nP -iTCP:${port} -sTCP:LISTEN | tail -n +2 | head -n 1`, {
            stdio: ["ignore", "pipe", "ignore"],
            encoding: "utf8"
        }).trim();
        if (!raw) return null;
        const cols = raw.split(/\s+/);
        return { pid: cols[1] || "unknown", command: cols[0] || "unknown command" };
    } catch (_) {
        return null;
    }
};

server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
        const owner = detectPortOwner(PORT);
        console.error(`PORT ${PORT} is already in use.`);
        console.error(`Owning PID: ${owner?.pid || "unknown"}`);
        console.error(`Owning command: ${owner?.command || "unknown command"}`);
        if (process.platform === "win32") {
            console.error(`Stop it with: Stop-Process -Id ${owner?.pid || "<pid>"} -Force`);
        } else {
            console.error(`Stop it with: kill -9 ${owner?.pid || "<pid>"}`);
        }
        process.exit(1);
    }

    console.error("SERVER STARTUP ERROR:", err.message);
    process.exit(1);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
