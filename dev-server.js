/**
 * Dev Server for CMS
 * Run: node dev-server.js
 * Open: http://localhost:3000/cms.html (CMS Admin)
 * Open: http://localhost:3000 (Website Preview)
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const ROOT = __dirname;
const CONTENT_FILE = path.join(ROOT, "data", "content.json");

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".webp": "image/webp",
};

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}

function handleAPI(req, res) {
  // GET /api/content - Read content.json
  if (req.method === "GET" && req.url === "/api/content") {
    fs.readFile(CONTENT_FILE, "utf8", (err, data) => {
      if (err) return sendJSON(res, 500, { error: "Failed to read content.json" });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    });
    return true;
  }

  // POST /api/content - Write content.json
  if (req.method === "POST" && req.url === "/api/content") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const json = JSON.parse(body);
        const formatted = JSON.stringify(json, null, 2);
        fs.writeFile(CONTENT_FILE, formatted, "utf8", (err) => {
          if (err) return sendJSON(res, 500, { error: "Failed to write content.json" });
          sendJSON(res, 200, { success: true, message: "Content saved!" });
        });
      } catch (e) {
        sendJSON(res, 400, { error: "Invalid JSON: " + e.message });
      }
    });
    return true;
  }

  // OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return true;
  }

  return false;
}

function serveStatic(req, res) {
  let filePath = path.join(ROOT, req.url === "/" ? "index.html" : req.url.split("?")[0]);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found: " + req.url);
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    if (!handleAPI(req, res)) {
      sendJSON(res, 404, { error: "API endpoint not found" });
    }
  } else {
    serveStatic(req, res);
  }
});

server.listen(PORT, () => {
  console.log("");
  console.log("  ╔══════════════════════════════════════════╗");
  console.log("  ║       🚀 Dev Server Running!             ║");
  console.log("  ╠══════════════════════════════════════════╣");
  console.log(`  ║  Website:  http://localhost:${PORT}          ║`);
  console.log(`  ║  CMS:      http://localhost:${PORT}/cms.html ║`);
  console.log("  ╚══════════════════════════════════════════╝");
  console.log("");
});
