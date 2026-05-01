import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(
    express.static(distPath, {
      etag: true,
      lastModified: true,
      maxAge: 0,
      setHeaders: (res, filePath) => {
        const lower = filePath.toLowerCase();
        if (lower.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache, must-revalidate");
          return;
        }
        // Vite emits hashed filenames into /assets/* — safe to cache long.
        if (lower.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          return;
        }
        // Other static assets (logos, og image, fonts) — moderate cache.
        res.setHeader("Cache-Control", "public, max-age=86400");
      },
    }),
  );

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
