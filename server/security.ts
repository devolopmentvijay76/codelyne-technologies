import type { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";

const isProd = process.env.NODE_ENV === "production";

const SELF = "'self'";
const UNSAFE_INLINE = "'unsafe-inline'";
const UNSAFE_EVAL = "'unsafe-eval'";
const DATA = "data:";
const BLOB = "blob:";
const HTTPS = "https:";

export function applySecurityHeaders(app: Express): void {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      hsts: isProd
        ? { maxAge: 60 * 60 * 24 * 365, includeSubDomains: true, preload: false }
        : false,
      frameguard: { action: "sameorigin" },
    }),
  );

  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      "Permissions-Policy",
      [
        "camera=()",
        "microphone=()",
        "geolocation=()",
        "interest-cohort=()",
        "browsing-topics=()",
        "payment=()",
      ].join(", "),
    );
    next();
  });

  if (isProd) {
    app.use((_req: Request, res: Response, next: NextFunction) => {
      const directives: Record<string, string[]> = {
        "default-src": [SELF],
        "base-uri": [SELF],
        "form-action": [SELF],
        "frame-ancestors": [SELF],
        "object-src": ["'none'"],
        "script-src": [
          SELF,
          UNSAFE_INLINE,
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://*.replit.com",
        ],
        "style-src": [SELF, UNSAFE_INLINE, "https://fonts.googleapis.com"],
        "font-src": [SELF, DATA, "https://fonts.gstatic.com"],
        "img-src": [SELF, DATA, BLOB, HTTPS],
        "media-src": [SELF, DATA, BLOB, HTTPS],
        "connect-src": [
          SELF,
          HTTPS,
          "wss:",
          "https://www.google-analytics.com",
          "https://*.googletagmanager.com",
        ],
        "frame-src": [
          SELF,
          "https://www.youtube.com",
          "https://www.youtube-nocookie.com",
          "https://player.vimeo.com",
        ],
        "worker-src": [SELF, BLOB],
        "manifest-src": [SELF],
        "upgrade-insecure-requests": [],
      };
      const csp = Object.entries(directives)
        .map(([k, vals]) => (vals.length ? `${k} ${vals.join(" ")}` : k))
        .join("; ");
      res.setHeader("Content-Security-Policy", csp);
      next();
    });
  } else {
    app.use((_req: Request, res: Response, next: NextFunction) => {
      const devCsp = [
        `default-src ${SELF} ${UNSAFE_INLINE} ${UNSAFE_EVAL} ${DATA} ${BLOB} ${HTTPS} ws: wss:`,
        `script-src ${SELF} ${UNSAFE_INLINE} ${UNSAFE_EVAL} ${HTTPS} ${BLOB}`,
        `style-src ${SELF} ${UNSAFE_INLINE} ${HTTPS}`,
        `img-src ${SELF} ${DATA} ${BLOB} ${HTTPS}`,
        `media-src ${SELF} ${DATA} ${BLOB} ${HTTPS}`,
        `font-src ${SELF} ${DATA} ${HTTPS}`,
        `connect-src ${SELF} ${HTTPS} ws: wss:`,
        `frame-src ${SELF} ${HTTPS}`,
        `worker-src ${SELF} ${BLOB}`,
        `object-src 'none'`,
      ].join("; ");
      res.setHeader("Content-Security-Policy-Report-Only", devCsp);
      next();
    });
  }
}
