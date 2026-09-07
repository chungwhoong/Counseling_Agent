type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

function log(level: LogLevel, message: string, data?: unknown): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(data !== undefined && { data }),
  };

  if (process.env.NODE_ENV === "production") {
    console[level](JSON.stringify(entry));
  } else {
    const prefix = { info: "ℹ️", warn: "⚠️", error: "❌" }[level];
    console[level](`${prefix} [${entry.timestamp}] ${message}`, data ?? "");
  }
}

export const logger = {
  info: (message: string, data?: unknown) => log("info", message, data),
  warn: (message: string, data?: unknown) => log("warn", message, data),
  error: (message: string, data?: unknown) => log("error", message, data),
};
