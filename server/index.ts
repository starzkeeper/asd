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
// ────────────────────────────────────────────────────────────

// Папка со статическим SPA-бандлом, который собрал Vite
//  - у вас после build:client он лежит в  dist/spa
const clientDist = path.join(__dirname, "../spa");

export function createServer() {
  const app = express();

  // ── middleware ───────────────────────────────────────────
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ── статика фронта ───────────────────────────────────────
  app.use(express.static(clientDist));

  // ── API ─────────────────────────────────────────────────
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);

  // ── fallback для роутинга SPA (history mode) ─────────────
  app.get("*", (_req, res) =>
    res.sendFile(path.join(clientDist, "index.html")),
  );

  return app;
}

/* Если запускаете «npm start» — исполняем сразу */
