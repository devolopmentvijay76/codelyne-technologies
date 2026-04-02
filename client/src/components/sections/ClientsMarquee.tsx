import { cn } from "@/lib/utils";
import { useClients } from "@/hooks/useClients";
import { Building2 } from "lucide-react";

const FALLBACK_CLIENTS = [
  { id: -1,  name: "TechNova Corp",        logoUrl: null, displayOrder: 0, createdAt: new Date() },
  { id: -2,  name: "Infra Dynamics",       logoUrl: null, displayOrder: 1, createdAt: new Date() },
  { id: -3,  name: "Nexgen Solutions",     logoUrl: null, displayOrder: 2, createdAt: new Date() },
  { id: -4,  name: "PrimeTech Industries", logoUrl: null, displayOrder: 3, createdAt: new Date() },
  { id: -5,  name: "Apex Enterprises",     logoUrl: null, displayOrder: 4, createdAt: new Date() },
  { id: -6,  name: "CoreLogic Systems",    logoUrl: null, displayOrder: 5, createdAt: new Date() },
  { id: -7,  name: "Vortex Analytics",     logoUrl: null, displayOrder: 6, createdAt: new Date() },
  { id: -8,  name: "Synapse Networks",     logoUrl: null, displayOrder: 7, createdAt: new Date() },
  { id: -9,  name: "GlobalTech Hub",       logoUrl: null, displayOrder: 8, createdAt: new Date() },
  { id: -10, name: "Quantum Ventures",     logoUrl: null, displayOrder: 9, createdAt: new Date() },
  { id: -11, name: "DataBridge Inc",       logoUrl: null, displayOrder: 10, createdAt: new Date() },
  { id: -12, name: "Pinnacle Group",       logoUrl: null, displayOrder: 11, createdAt: new Date() },
];

const GLOW_COLORS = [
  { color: "#3b82f6", glow: "rgba(59,130,246,0.5)" },
  { color: "#8b5cf6", glow: "rgba(139,92,246,0.5)" },
  { color: "#06b6d4", glow: "rgba(6,182,212,0.5)" },
  { color: "#10b981", glow: "rgba(16,185,129,0.5)" },
  { color: "#f59e0b", glow: "rgba(245,158,11,0.5)" },
  { color: "#ef4444", glow: "rgba(239,68,68,0.5)" },
  { color: "#6366f1", glow: "rgba(99,102,241,0.5)" },
  { color: "#14b8a6", glow: "rgba(20,184,166,0.5)" },
  { color: "#f97316", glow: "rgba(249,115,22,0.5)" },
  { color: "#a855f7", glow: "rgba(168,85,247,0.5)" },
  { color: "#0ea5e9", glow: "rgba(14,165,233,0.5)" },
  { color: "#22c55e", glow: "rgba(34,197,94,0.5)" },
];

type ClientItem = { id: number; name: string; logoUrl: string | null; displayOrder: number | null; createdAt: Date };

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function LogoCard({ client, colorIdx }: { client: ClientItem; colorIdx: number }) {
  const { color, glow } = GLOW_COLORS[colorIdx % GLOW_COLORS.length];

  return (
    <div
      className="flex items-center gap-4 px-5 py-3 rounded-2xl border mx-3 shrink-0 group transition-transform duration-300 hover:scale-105"
      style={{
        background: `linear-gradient(135deg, ${color}18, ${color}08)`,
        borderColor: `${color}40`,
        boxShadow: `0 0 18px ${glow}22`,
      }}
    >
      {/* Logo / initials circle */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden shrink-0 font-bold text-base font-heading"
        style={{
          background: `linear-gradient(135deg, ${color}40, ${color}20)`,
          border: `1.5px solid ${color}60`,
          boxShadow: `0 0 14px ${glow}`,
          color,
        }}
      >
        {client.logoUrl ? (
          <img
            src={client.logoUrl}
            alt={client.name}
            className="w-full h-full object-contain"
          />
        ) : (
          getInitials(client.name)
        )}
      </div>
      {/* Company name */}
      <span
        className="text-sm font-semibold whitespace-nowrap"
        style={{ color: `${color}dd` }}
      >
        {client.name}
      </span>
    </div>
  );
}

export function ClientsMarquee() {
  const { clients: dbClients, isLoading } = useClients();

  const displayClients: ClientItem[] = (dbClients.length > 0 ? dbClients : FALLBACK_CLIENTS);
  const minItems = 10;
  const repeated = displayClients.length < minItems
    ? Array.from({ length: Math.ceil(minItems / displayClients.length) }, () => displayClients).flat()
    : displayClients;
  const doubled = [...repeated, ...repeated];

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background glow layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1221]/80 via-primary/5 to-[#0b1221]/80 pointer-events-none" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

      {/* Section header */}
      <div className="relative z-10 text-center mb-10 px-6">
        <p className="text-xs font-semibold tracking-[0.3em] text-primary/70 uppercase mb-2">Trusted By</p>
        <h3 className="text-2xl md:text-3xl font-heading font-bold text-white">
          Industry Leaders <span className="text-primary text-glow">Partner With Us</span>
        </h3>
      </div>

      {/* Marquee track */}
      <div className="relative z-10">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-20 pointer-events-none bg-gradient-to-r from-[#0b1221] to-transparent" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 z-20 pointer-events-none bg-gradient-to-l from-[#0b1221] to-transparent" />

        <div className="overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex animate-marquee-rtl">
              {doubled.map((client, i) => (
                <LogoCard key={`${client.id}-${i}`} client={client} colorIdx={i % GLOW_COLORS.length} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
