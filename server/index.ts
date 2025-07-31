// src/server/index.ts  (пример полного файла)

import "dotenv/config";
import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { handleDemo } from "./routes/demo";

// ─── ✅ расчёт __dirname для ES-модуля ──────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
// ─────────���──────────────────────────────────────────────────

// Папка со статическим SPA-бандлом, который собрал Vite
//  - у вас после build:client он лежит в  dist/spa
const clientDist = path.join(__dirname, "../spa");

export function createServer() {
  const app = express();

  // ── middleware ───────────────────────────────────────────
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ── API ─────────────────────────────────────────────────
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);

  // Check if we're in development mode (when used with Vite)
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (!isDevelopment) {
    // ── статика фронта (только в продакшне) ──────────────────
    app.use(express.static(clientDist));

    // ── fallback для роутинга SPA (только в продакшне) ──────
    app.get("*", (_req, res) =>
      res.sendFile(path.join(clientDist, "index.html")),
    );
  }

  return app;
}

/* Если запускаете «npm start» — исполняем сразу */
