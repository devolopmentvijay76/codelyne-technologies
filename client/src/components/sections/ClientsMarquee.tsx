import { cn } from "@/lib/utils";

const clients = [
  { name: "TechNova Corp",        initials: "TN", color: "#3b82f6", glow: "rgba(59,130,246,0.5)"  },
  { name: "Infra Dynamics",       initials: "ID", color: "#8b5cf6", glow: "rgba(139,92,246,0.5)"  },
  { name: "Nexgen Solutions",     initials: "NG", color: "#06b6d4", glow: "rgba(6,182,212,0.5)"   },
  { name: "PrimeTech Industries", initials: "PT", color: "#10b981", glow: "rgba(16,185,129,0.5)"  },
  { name: "Apex Enterprises",     initials: "AE", color: "#f59e0b", glow: "rgba(245,158,11,0.5)"  },
  { name: "CoreLogic Systems",    initials: "CL", color: "#ef4444", glow: "rgba(239,68,68,0.5)"   },
  { name: "Vortex Analytics",     initials: "VA", color: "#6366f1", glow: "rgba(99,102,241,0.5)"  },
  { name: "Synapse Networks",     initials: "SN", color: "#14b8a6", glow: "rgba(20,184,166,0.5)"  },
  { name: "GlobalTech Hub",       initials: "GT", color: "#f97316", glow: "rgba(249,115,22,0.5)"  },
  { name: "Quantum Ventures",     initials: "QV", color: "#a855f7", glow: "rgba(168,85,247,0.5)"  },
  { name: "DataBridge Inc",       initials: "DB", color: "#0ea5e9", glow: "rgba(14,165,233,0.5)"  },
  { name: "Pinnacle Group",       initials: "PG", color: "#22c55e", glow: "rgba(34,197,94,0.5)"   },
  { name: "StratoCloud Ltd",      initials: "SC", color: "#ec4899", glow: "rgba(236,72,153,0.5)"  },
  { name: "ZenithAI Systems",     initials: "ZA", color: "#06b6d4", glow: "rgba(6,182,212,0.5)"   },
  { name: "OmniCore Tech",        initials: "OC", color: "#8b5cf6", glow: "rgba(139,92,246,0.5)"  },
];

function LogoCard({ client }: { client: typeof clients[0] }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-2xl border mx-3 shrink-0 group transition-transform duration-300 hover:scale-105"
      style={{
        background: `linear-gradient(135deg, ${client.color}18, ${client.color}08)`,
        borderColor: `${client.color}40`,
        boxShadow: `0 0 18px ${client.glow}22`,
      }}
    >
      {/* Logo circle */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 font-heading"
        style={{
          background: `linear-gradient(135deg, ${client.color}40, ${client.color}20)`,
          border: `1.5px solid ${client.color}60`,
          boxShadow: `0 0 14px ${client.glow}`,
          color: client.color,
        }}
      >
        {client.initials}
      </div>
      {/* Company name */}
      <span
        className="text-sm font-semibold whitespace-nowrap"
        style={{ color: `${client.color}dd` }}
      >
        {client.name}
      </span>
    </div>
  );
}

export function ClientsMarquee() {
  const doubledClients = [...clients, ...clients];

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
          <div className="flex animate-marquee-rtl">
            {doubledClients.map((client, i) => (
              <LogoCard key={`${client.name}-${i}`} client={client} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
