import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("logicloop.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT,
    data TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS variables (
    id TEXT PRIMARY KEY,
    name TEXT,
    address TEXT,
    type TEXT,
    value TEXT,
    description TEXT
  );
  
  CREATE TABLE IF NOT EXISTS hardware_settings (
    id TEXT PRIMARY KEY,
    config TEXT
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/projects", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects ORDER BY updated_at DESC").all() as any[];
    res.json(projects.map(p => ({ ...p, data: JSON.parse(p.data as string) })));
  });

  app.post("/api/projects", (req, res) => {
    const { id, name, data } = req.body;
    const stmt = db.prepare("INSERT OR REPLACE INTO projects (id, name, data, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)");
    stmt.run(id, name, JSON.stringify(data));
    res.json({ status: "ok" });
  });

  app.get("/api/variables", (req, res) => {
    const variables = db.prepare("SELECT * FROM variables").all();
    res.json(variables);
  });

  app.post("/api/variables", (req, res) => {
    const vars = req.body; // Expecting an array
    const deleteStmt = db.prepare("DELETE FROM variables");
    const insertStmt = db.prepare("INSERT INTO variables (id, name, address, type, value, description) VALUES (?, ?, ?, ?, ?, ?)");
    
    const transaction = db.transaction((data) => {
      deleteStmt.run();
      for (const v of data) {
        insertStmt.run(v.id, v.name, v.address, v.type, JSON.stringify(v.value), v.description);
      }
    });
    
    transaction(vars);
    res.json({ status: "ok" });
  });

  app.get("/api/hardware", (req, res) => {
    const settings = db.prepare("SELECT * FROM hardware_settings WHERE id = 'default'").get();
    res.json(settings ? JSON.parse((settings as any).config) : {});
  });

  app.post("/api/hardware", (req, res) => {
    const config = req.body;
    const stmt = db.prepare("INSERT OR REPLACE INTO hardware_settings (id, config) VALUES ('default', ?)");
    stmt.run(JSON.stringify(config));
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
