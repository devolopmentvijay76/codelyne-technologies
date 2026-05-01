import { sql } from "drizzle-orm";
import { db } from "../backend/server/db";
import { clients, content, employees, products } from "../backend/shared/schema";

type LiveProduct = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  features?: string | null;
  logoUrl?: string | null;
  icon?: string | null;
  videoUrl?: string | null;
  usp?: string | null;
  domains?: string | null;
  status?: string;
  displayOrder?: number | null;
  createdAt?: string;
};

type LiveClient = {
  id: number;
  name: string;
  logoUrl?: string | null;
  displayOrder?: number | null;
  createdAt?: string;
};

type LiveEmployee = {
  id: number;
  name: string;
  role: string;
  department: string;
  memberType: string;
  photoUrl?: string | null;
  description?: string | null;
  quote?: string | null;
  focusAreas?: string | null;
};

type LiveContent = { id: number; key: string; value: string; updatedAt?: string };

function truthy(v: string | undefined) {
  if (!v) return false;
  return ["1", "true", "yes", "on"].includes(v.toLowerCase());
}

function emptyToNull(v: unknown) {
  if (v === undefined || v === null) return null;
  if (typeof v === "string" && v.trim().length === 0) return null;
  return v;
}

async function fetchJson<T>(baseUrl: string, path: string): Promise<T> {
  const url = `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch ${url}: ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

async function tableHasAnyRows(tableName: "products" | "clients" | "employees" | "content"): Promise<boolean> {
  switch (tableName) {
    case "products": {
      const rows = await db.select({ id: products.id }).from(products).limit(1);
      return rows.length > 0;
    }
    case "clients": {
      const rows = await db.select({ id: clients.id }).from(clients).limit(1);
      return rows.length > 0;
    }
    case "employees": {
      const rows = await db.select({ id: employees.id }).from(employees).limit(1);
      return rows.length > 0;
    }
    case "content": {
      const rows = await db.select({ id: content.id }).from(content).limit(1);
      return rows.length > 0;
    }
  }

  // Should be unreachable because of the string union type, but satisfies TS exhaustiveness.
  return false;
}

async function truncateDevTables() {
  // Only truncate the dynamic content tables (leave users/admin alone).
  await db.execute(sql`TRUNCATE TABLE products RESTART IDENTITY CASCADE;`);
  await db.execute(sql`TRUNCATE TABLE clients RESTART IDENTITY CASCADE;`);
  await db.execute(sql`TRUNCATE TABLE employees RESTART IDENTITY CASCADE;`);
  await db.execute(sql`TRUNCATE TABLE content RESTART IDENTITY CASCADE;`);
}

async function main() {
  const liveBaseUrl =
    process.env.LIVE_BASE_URL?.trim() || "https://codelyne-website-v-2.replit.app";
  const seedFromLive = truthy(process.env.SEED_FROM_LIVE);
  const forceSeed = truthy(process.env.FORCE_SEED_FROM_LIVE);

  if (!seedFromLive) {
    console.log("seed-from-live: disabled (SEED_FROM_LIVE is falsey)");
    return;
  }

  const [hasProducts, hasClients, hasEmployees, hasContent] = await Promise.all([
    tableHasAnyRows("products"),
    tableHasAnyRows("clients"),
    tableHasAnyRows("employees"),
    tableHasAnyRows("content"),
  ]);

  if (forceSeed) {
    console.log("seed-from-live: FORCE_SEED_FROM_LIVE=1 -> truncating tables");
    await truncateDevTables();
  } else {
    if (hasProducts && hasClients && hasEmployees && hasContent) {
      console.log("seed-from-live: local DB already looks seeded; skipping");
      return;
    }
    // If any one of the dynamic tables is missing, truncate the whole set so local UI
    // matches live consistently (and we avoid duplicates).
    console.log("seed-from-live: partial/missing data detected -> truncating tables");
    await truncateDevTables();
  }

  const [liveProducts, liveClients, liveTeam, liveContent] = await Promise.all([
    fetchJson<LiveProduct[]>(liveBaseUrl, "/api/products"),
    fetchJson<LiveClient[]>(liveBaseUrl, "/api/clients"),
    fetchJson<LiveEmployee[]>(liveBaseUrl, "/api/public/team"),
    fetchJson<LiveContent[]>(liveBaseUrl, "/api/content"),
  ]);

  // Products
  const productsToInsert = liveProducts.map((p) => ({
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    features: emptyToNull(p.features),
    logoUrl: emptyToNull(p.logoUrl),
    icon: emptyToNull(p.icon),
    videoUrl: emptyToNull(p.videoUrl),
    usp: emptyToNull(p.usp),
    domains: emptyToNull(p.domains),
    status: p.status ?? "active",
    displayOrder: p.displayOrder ?? 0,
  }));
  await db.insert(products).values(productsToInsert).execute();

  // Clients
  const clientsToInsert = liveClients.map((c) => ({
    name: c.name,
    logoUrl: emptyToNull(c.logoUrl),
    displayOrder: c.displayOrder ?? 0,
  }));
  await db.insert(clients).values(clientsToInsert).execute();

  // Employees (team)
  const employeesToInsert = liveTeam.map((e, index) => ({
    name: e.name,
    role: e.role,
    department: e.department,
    memberType: e.memberType,
    photoUrl: emptyToNull(e.photoUrl),
    description: emptyToNull(e.description),
    quote: emptyToNull(e.quote),
    focusAreas: emptyToNull(e.focusAreas),
    // Preserve the API order from live so About/Admin screens match as closely as possible.
    displayOrder: index,
  }));
  await db.insert(employees).values(employeesToInsert).execute();

  // Content (vision/mission)
  const contentToInsert = liveContent.map((c) => ({
    key: c.key,
    value: c.value,
  }));
  await db.insert(content).values(contentToInsert).execute();

  console.log("seed-from-live: completed successfully");
}

main().catch((err) => {
  console.error("seed-from-live: failed", err);
  process.exit(1);
});

