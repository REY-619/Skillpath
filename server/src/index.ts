import "dotenv/config";
import express from "express";
import cors from "cors";
import { checkConnection, closeDriver } from "./lib/db.js";
import { errorMiddleware } from "./lib/http.js";
import { peopleRouter } from "./routes/people.js";
import { skillsRouter } from "./routes/skills.js";
import { careersRouter } from "./routes/careers.js";
import { coursesRouter } from "./routes/courses.js";
import { graphRouter } from "./routes/graph.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  const status = await checkConnection();
  res.status(status.ok ? 200 : 503).json(status);
});

app.use("/api/people", peopleRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/careers", careersRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/graph", graphRouter);

app.use(errorMiddleware);

const server = app.listen(port, () => {
  console.log(`SkillPath API listening on http://localhost:${port}`);
});

async function shutdown() {
  console.log("Shutting down...");
  server.close();
  await closeDriver();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

import dns from "node:dns/promises";
import net from "node:net";

async function testCognoNetwork() {
  const host = "db-6d64716d2.databases.cognodb.com";
  const port = 7687;

  try {
    const dnsResult = await dns.lookup(host);

    console.log("COGNODB DNS:", dnsResult);

    const socket = net.createConnection({
      host,
      port,
      timeout: 10000,
    });

    socket.on("connect", () => {
      console.log("COGNODB TCP: CONNECTED");
      socket.destroy();
    });

    socket.on("timeout", () => {
      console.error("COGNODB TCP: TIMEOUT");
      socket.destroy();
    });

    socket.on("error", (error) => {
      console.error("COGNODB TCP ERROR:", error);
    });
  } catch (error) {
    console.error("COGNODB DNS ERROR:", error);
  }
}

testCognoNetwork();
