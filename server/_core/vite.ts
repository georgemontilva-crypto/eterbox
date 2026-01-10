import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

function findDistPath(): string {
  // Try multiple possible locations for the dist/public directory
  const possiblePaths = [
    // Railway/production: compiled code is in /app/dist/index.js, so public is at /app/dist/public
    path.resolve(import.meta.dirname, "public"),
    // Alternative: if __dirname is /app/dist, try /app/dist/public
    path.resolve(import.meta.dirname, "..", "dist", "public"),
    // Local development fallback: from project root
    path.resolve(process.cwd(), "dist", "public"),
    // Another fallback: from __dirname go up to root then to dist/public
    path.resolve(import.meta.dirname, "../..", "dist", "public"),
  ];

  console.log("[serveStatic] Searching for dist/public in multiple locations...");
  console.log("[serveStatic] import.meta.dirname:", import.meta.dirname);
  console.log("[serveStatic] process.cwd():", process.cwd());

  for (const distPath of possiblePaths) {
    console.log("[serveStatic] Trying:", distPath);
    if (fs.existsSync(distPath)) {
      const indexPath = path.resolve(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        console.log("✅ [serveStatic] Found dist/public at:", distPath);
        return distPath;
      } else {
        console.log("⚠️  [serveStatic] Found directory but no index.html");
      }
    } else {
      console.log("❌ [serveStatic] Not found");
    }
  }

  // If nothing found, list what we have
  console.error("❌ [serveStatic] Could not find dist/public in any location!");
  console.error("[serveStatic] Listing current directory structure:");
  try {
    console.error("[serveStatic] Files in __dirname:", fs.readdirSync(import.meta.dirname));
    const parent = path.resolve(import.meta.dirname, "..");
    console.error("[serveStatic] Files in parent:", fs.readdirSync(parent));
  } catch (e) {
    console.error("[serveStatic] Error listing:", e);
  }

  // Return first path as fallback (will show error but won't crash)
  return possiblePaths[0];
}

export function serveStatic(app: Express) {
  const distPath = findDistPath();
  const indexPath = path.resolve(distPath, "index.html");

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(indexPath);
  });
}
