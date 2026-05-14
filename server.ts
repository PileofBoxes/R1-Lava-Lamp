import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  const sendManifest = (req: any, res: any) => {
    console.log(`[Creations] Manifest requested from ${req.ip} at ${req.path}. User-Agent: ${req.get('user-agent')}`);
    
    // Enable CORS for Rabbit R1
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.get("host");
    const origin = `${protocol}://${host}`;

    // Standard Rabbit R1 Creations Manifest structure
    res.json({
      title: "Lava Lamp",
      url: origin.endsWith('/') ? origin : `${origin}/`,
      description: "An organic lava lamp simulation.",
      iconUrl: "https://img.icons8.com/color/96/000000/fire-element.png",
      themeColor: "#FF4E00",
      manifest_version: 1,
      id: "com.aistudio.lavalamp",
      version: "1.0.0",
      developer: "AI Studio",
      platforms: ["r1"]
    });
  };

  app.options("/creations.json", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).send();
  });

  app.get("/creations.json", sendManifest);
  app.get("/creation.json", sendManifest);
  app.get("/.well-known/creations.json", sendManifest);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
