// server/index.js
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { flows } from "./dialogFlows.js";
import { handleUserMessage } from "./dialogManager.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

const sessions = new Map();

wss.on("connection", (ws) => {
  let session = null;

  ws.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg.toString());

      if (data.type === "start") {
        const flow = flows[data.flow];
        if (!flow)
          return ws.send(
            JSON.stringify({ type: "error", text: "Invalid flow" })
          );

        session = {
          flowId: data.flow,
          flow,
          currentIndex: 0,
          answers: {},
          completed: false,
        };

        sessions.set(ws, session);
        const firstQuestion = flow[0].questionText;
        await handleUserMessage(ws, session, null, firstQuestion); // kickoff
      }

      if (data.type === "userText") {
        if (!session) return;
        await handleUserMessage(ws, session, data.text);
      }
    } catch (err) {
      console.error("Error handling message:", err);
    }
  });

  ws.on("close", () => {
    sessions.delete(ws);
  });
});

server.listen(4001, () => {
  console.log("🧠 WS Server running on http://localhost:4001/ws");
});
