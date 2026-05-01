# Codelyne Technologies Website

## Overview

Codelyne Technologies is an AI-driven software and product engineering company website built with a modern full-stack architecture. The application features a marketing website with company information, founder profiles, team pages, and a contact system, along with an admin panel for content management. The design follows an AI-first, enterprise-grade aesthetic with a deep tech blue and white color palette.

## Next.js Migration (in progress, sibling at `codelyne-next/`)

A Next.js 15 App Router rewrite lives alongside the original Vite app and does **not** replace it. Original `client/`, `server/`, root `package.json`, and `Start application` workflow are untouched.

- **Pages**: `app/page.tsx`, `app/about-us/`, `app/founders/`, `app/login/`, `app/products/[id]/`, `app/admin/`, `app/not-found.tsx`.
- **Auth**: Express+Passport replaced by `iron-session` cookie `codelyne_session`. Requires `SESSION_SECRET` (≥32 chars) at startup.
- **Setup endpoint**: `app/api/setup/init` requires both `SETUP_KEY` (≥16 chars) and `ADMIN_INITIAL_PASSWORD` (≥12 chars) env vars. No insecure default credentials.
- **Object storage**: `/objects/[...path]` route enforces ACL via `canAccessObject` (public-readable allowed; otherwise requires authenticated session).
- **Routing**: wouter → `next/navigation` (`useRouter`, `useParams`) and `next/link`.
- **Assets**: Vite `@assets/*` imports → `/attached_assets/*` absolute public paths (special chars URL-encoded).
- **Run**: from `codelyne-next/`, `npm install` then `npm run dev` (port 5000). Not yet wired to a Replit workflow.

## Performance, Security & Compliance (April 2026)

### Security Headers (`server/security.ts`)
- `helmet()` provides X-Content-Type-Options, X-Frame-Options (SAMEORIGIN), Referrer-Policy (strict-origin-when-cross-origin), Cross-Origin-Opener-Policy (same-origin-allow-popups), Cross-Origin-Resource-Policy (cross-origin), and HSTS (1y, includeSubDomains) in production only.
- Custom Permissions-Policy disables camera/microphone/geolocation/FLoC/Topics/payment.
- Custom strict CSP applied **only in production** (allows Google Fonts, GA/GTM, YouTube/Vimeo embeds, blob/data images, https media). In development a permissive `Content-Security-Policy-Report-Only` header is used so Vite HMR (`unsafe-inline`/`unsafe-eval`/`ws:`) keeps working.
- Wired in `server/index.ts` via `applySecurityHeaders(app)` *before* any routes/middleware.

### Static caching (`server/static.ts`)
- `/assets/*` (Vite-hashed) → `public, max-age=31536000, immutable`.
- `index.html` and SPA fallback → `no-cache, must-revalidate`.
- All other static files → `public, max-age=86400`.

### Code splitting (`client/src/App.tsx`)
- All routes except `/` and 404 are loaded via `React.lazy` (`Admin`, `Login`, `Founders`, `AboutUs`, `ProductDetail`).
- Wrapped in `<Suspense>` with an accessible loading spinner.

### Image / media performance
- `loading="lazy"` + `decoding="async"` + explicit `width`/`height` on Products logos, ClientsMarquee logos, Features background and `ProtectedImage`.
- Decorative images marked `alt=""` `aria-hidden="true"` (e.g. Features bg).
- Hero background `<video>` uses `preload="metadata"` and `aria-hidden="true"`.
- `ProtectedImage` now accepts `loading`, `fetchPriority`, `decoding`, `width`, `height` props (default `lazy` + `async`).

### Cookie Consent (DPDPA + GDPR) — `client/src/components/CookieConsent.tsx`
- Categories: **Necessary** (locked on), **Analytics**, **Marketing**, **Preferences**.
- Default state = necessary-only (rejected). Banner shows until the user makes a choice.
- Buttons: **Accept all**, **Reject non-essential**, **Customize** (per-category switches → **Save preferences**).
- Persisted to `localStorage` under `codelyne_cookie_consent_v1`.
- Emits `window` `CustomEvent('codelyne:consent-change', detail)` so analytics/marketing scripts can gate themselves.
- Listens for `codelyne:open-cookie-settings` → re-opens the banner from anywhere; the Footer **Cookie Settings** link uses this.
- Helpers exported: `getStoredConsent()`, `hasConsent(category)`.
- No analytics scripts are currently loaded in `index.html`; future GA/GTM injection should call `hasConsent('analytics')` before initialising.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **State Management**: TanStack React Query for server state and caching
- **Forms**: React Hook Form with Zod validation

**Key Design Patterns**:
- Component-based architecture with clear separation between pages, sections, layout, and UI components
- Custom hooks for data fetching (useAuth, useEmployees, useContent, useContactSubmissions)
- Path aliases configured for clean imports (@/ for client/src, @shared/ for shared code)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript compiled with tsx for development and esbuild for production
- **API Design**: RESTful endpoints under /api prefix
- **Authentication**: Passport.js with local strategy, session-based auth using express-session
- **Password Security**: bcrypt for password hashing

**Key Design Patterns**:
- Centralized route registration in routes.ts
- Storage interface pattern (IStorage) for database operations
- Shared schema validation between frontend and backend using Zod

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation integration
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Migrations**: Drizzle Kit for schema migrations (output to /migrations)

**Database Schema**:
- `users`: Admin authentication (id, username, password)
- `employees`: Team member management (name, role, department, email, phone, joinDate)
- `content`: CMS-style key-value content storage (vision, mission, etc.)
- `contactSubmissions`: Contact form submissions storage

### Build System
- Development: Vite dev server with HMR, proxied through Express
- Production: Vite builds to dist/public, Express serves static files
- Server bundling: esbuild with selective dependency bundling for faster cold starts

## External Dependencies

### Database
- PostgreSQL database (connection via DATABASE_URL environment variable)
- Drizzle ORM for database operations

### UI Libraries
- Radix UI for accessible component primitives
- Lucide React for iconography
- Embla Carousel for hero slider
- Vaul for drawer components

### Authentication
- Passport.js with passport-local strategy
- express-session with connect-pg-simple for session persistence
- bcrypt for password hashing

### Development Tools
- Replit-specific plugins: vite-plugin-cartographer, vite-plugin-dev-banner, runtime-error-modal
- Custom vite-plugin-meta-images for OpenGraph image handling

### Fonts
- Outfit (headings)
- Plus Jakarta Sans (body text)
- Loaded via Google Fonts CDN