import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const port = Number(process.env.PORT) || 5000; // ✅ Port declared at the top

// Parse JSON + URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Dev: setup Vite as middleware
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Prod: serve static files
    serveStatic(app);
  }

  // ✅ Start the server
  server.listen(
    {
      port,
      host: "127.0.0.1", // safer on Windows than 0.0.0.0
    },
    () => {
      log(`🚀 Server running at http://127.0.0.1:${port}`);
    }
  );

  // ✅ Catch-all route for SPA (production only)
  app.get("*", (req, res) => {
    res.sendFile("index.html", { root: "dist/client" });
  });
})();
