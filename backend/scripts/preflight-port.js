const net = require("net");
const { execFileSync, execSync } = require("child_process");

const port = Number(process.env.PORT || 5000);

const detectWindowsProcess = (targetPort) => {
    try {
        const lookupCmd = `$conn = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq ${targetPort} } | Select-Object -First 1 OwningProcess; if ($conn) { $proc = Get-CimInstance Win32_Process -Filter "ProcessId = $($conn.OwningProcess)" | Select-Object ProcessId, CommandLine; if ($proc) { Write-Output "$($proc.ProcessId)|$($proc.CommandLine)" } }`;
        const raw = execFileSync("powershell", ["-NoProfile", "-Command", lookupCmd], {
            stdio: ["ignore", "pipe", "ignore"],
            encoding: "utf8"
        }).trim();

        if (!raw) return null;
        const [pid, ...cmdParts] = raw.split("|");
        return {
            pid: pid || "unknown",
            command: cmdParts.join("|").trim() || "unknown command"
        };
    } catch (_) {
        return null;
    }
};

const detectUnixProcess = (targetPort) => {
    try {
        const raw = execSync(`lsof -nP -iTCP:${targetPort} -sTCP:LISTEN | tail -n +2 | head -n 1`, {
            stdio: ["ignore", "pipe", "ignore"],
            encoding: "utf8"
        }).trim();

        if (!raw) return null;
        const cols = raw.split(/\s+/);
        return {
            pid: cols[1] || "unknown",
            command: cols[0] || "unknown command"
        };
    } catch (_) {
        return null;
    }
};

const detectProcessOnPort = (targetPort) => {
    if (process.platform === "win32") {
        return detectWindowsProcess(targetPort);
    }
    return detectUnixProcess(targetPort);
};

const printConflictAndExit = (found) => {
    const pid = found?.pid || "unknown";
    const command = found?.command || "unknown command";

    console.error(`\n[preflight] Port ${port} is already in use.`);
    console.error(`[preflight] PID: ${pid}`);
    console.error(`[preflight] Command: ${command}`);
    if (process.platform === "win32") {
        console.error(`[preflight] Stop it with: Stop-Process -Id ${pid} -Force`);
    } else {
        console.error(`[preflight] Stop it with: kill -9 ${pid}`);
    }
    console.error("[preflight] Aborting startup to avoid nodemon crash loops.\n");
    process.exit(1);
};

const existingOwner = detectProcessOnPort(port);
if (existingOwner) {
    printConflictAndExit(existingOwner);
}

const probe = net.createServer();
probe.unref();

probe.once("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
        printConflictAndExit(detectProcessOnPort(port));
        return;
    }
    console.error(`[preflight] Failed to verify port ${port}: ${err.message}`);
    process.exit(1);
});

probe.listen(port, "0.0.0.0", () => {
    probe.close(() => {
        console.log(`[preflight] Port ${port} is available.`);
        process.exit(0);
    });
});
