# Codelyne Technologies Website

## Overview

Codelyne Technologies is an AI-driven software and product engineering company website built with a modern full-stack architecture. The application features a marketing website with company information, founder profiles, team pages, and a contact system, along with an admin panel for content management. The design follows an AI-first, enterprise-grade aesthetic with a deep tech blue and white color palette.

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