import type { Express } from "express";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { setObjectAclPolicy } from "./objectAcl";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

function getLocalUploadsDir() {
  const dir = process.env.LOCAL_UPLOADS_DIR?.trim() || "public/uploads";
  return path.resolve(process.cwd(), dir);
}

function sanitizeExt(fileName?: string): string {
  if (!fileName) return "";
  const ext = path.extname(fileName).toLowerCase();
  return /^[.][a-z0-9]{1,10}$/.test(ext) ? ext : "";
}

/**
 * Register object storage routes for file uploads.
 *
 * This provides example routes for the presigned URL upload flow:
 * 1. POST /api/uploads/request-url - Get a presigned URL for uploading
 * 2. The client then uploads directly to the presigned URL
 *
 * IMPORTANT: These are example routes. Customize based on your use case:
 * - Add authentication middleware for protected uploads
 * - Add file metadata storage (save to database after upload)
 * - Add ACL policies for access control
 */
export function registerObjectStorageRoutes(app: Express): void {
  const objectStorageService = new ObjectStorageService();

  /**
   * Request a presigned URL for file upload.
   *
   * Request body (JSON):
   * {
   *   "name": "filename.jpg",
   *   "size": 12345,
   *   "contentType": "image/jpeg"
   * }
   *
   * Response:
   * {
   *   "uploadURL": "https://storage.googleapis.com/...",
   *   "objectPath": "/objects/uploads/uuid"
   * }
   *
   * IMPORTANT: The client should NOT send the file to this endpoint.
   * Send JSON metadata only, then upload the file directly to uploadURL.
   */
  app.post("/api/uploads/request-url", async (req, res) => {
    try {
      const { name, size, contentType } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Missing required field: name",
        });
      }

      let uploadURL: string;
      let objectPath: string;

      try {
        // Replit object storage path (works on Replit runtime).
        uploadURL = await objectStorageService.getObjectEntityUploadURL();
        objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
      } catch (storageError) {
        // Local Docker fallback: store files on disk and serve from /uploads/*.
        const id = randomUUID();
        const ext = sanitizeExt(name);
        uploadURL = `/api/uploads/local/${id}${ext}`;
        objectPath = `/uploads/${id}${ext}`;
        console.warn(
          "Falling back to local disk uploads. Replit object storage unavailable.",
          storageError,
        );
      }

      res.json({
        uploadURL,
        objectPath,
        // Echo back the metadata for client convenience
        metadata: { name, size, contentType },
      });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  /**
   * Mark an uploaded object as public (for profile photos).
   */
  app.post("/api/uploads/make-public", async (req, res) => {
    try {
      const { objectPath } = req.body;
      if (!objectPath) {
        return res.status(400).json({ error: "Missing objectPath" });
      }
      if (!objectPath.startsWith("/objects/")) {
        return res.json({ success: true, objectPath, skipped: true });
      }
      const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
      await setObjectAclPolicy(objectFile, {
        owner: "system",
        visibility: "public",
      });
      res.json({ success: true, objectPath });
    } catch (error) {
      console.error("Error setting public ACL:", error);
      res.status(500).json({ error: "Failed to set public access" });
    }
  });

  /**
   * Serve uploaded objects.
   *
   * GET /objects/:objectPath(*)
   *
   * This serves files from object storage. For public files, no auth needed.
   * For protected files, add authentication middleware and ACL checks.
   */
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ error: "Object not found" });
      }
      return res.status(500).json({ error: "Failed to serve object" });
    }
  });

  // Local upload fallback endpoint: receives raw file bytes via PUT.
  app.put("/api/uploads/local/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      if (!/^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9]{1,10})?$/.test(filename)) {
        return res.status(400).json({ error: "Invalid filename" });
      }

      const uploadDir = getLocalUploadsDir();
      await fs.promises.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, filename);
      const chunks: Buffer[] = [];

      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      req.on("error", (err) => {
        console.error("Error receiving upload stream:", err);
      });
      req.on("end", async () => {
        try {
          const data = Buffer.concat(chunks);
          await fs.promises.writeFile(filePath, data);
          res.status(200).json({ success: true, objectPath: `/uploads/${filename}` });
        } catch (error) {
          console.error("Error writing local upload file:", error);
          res.status(500).json({ error: "Failed to save file locally" });
        }
      });
    } catch (error) {
      console.error("Error handling local upload:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Serve locally uploaded files in Docker/local development.
  app.get("/uploads/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      if (!/^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9]{1,10})?$/.test(filename)) {
        return res.status(400).json({ error: "Invalid filename" });
      }
      const uploadDir = getLocalUploadsDir();
      const filePath = path.join(uploadDir, filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
      }
      res.sendFile(filePath);
    } catch (error) {
      console.error("Error serving local upload:", error);
      res.status(500).json({ error: "Failed to serve file" });
    }
  });
}

