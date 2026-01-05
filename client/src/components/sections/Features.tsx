import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Zap, Database, Globe, Lock, Brain } from "lucide-react";
import techBg from "@assets/generated_images/abstract_cybernetic_circuit_board_pattern,_soft_blue_glow.png";

const features = [
  {
    icon: Brain,
    title: "AI-First Architecture",
    description: "Built from the ground up with neural networks and machine learning capabilities embedded in the core."
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description: "Bank-grade encryption and security protocols ensuring your data remains protected at all times."
  },
  {
    icon: Zap,
    title: "High Performance",
    description: "Optimized for speed and efficiency, ensuring near-zero latency for critical operations."
  },
  {
    icon: Database,
    title: "Scalable Infrastructure",
    description: "Cloud-native designs that grow with your business, handling millions of requests effortlessly."
  },
  {
    icon: Globe,
    title: "Global Connectivity",
    description: "Seamless integration with global networks and edge computing nodes for worldwide access."
  },
  {
    icon: Lock,
    title: "Data Sovereignty",
    description: "Complete control over your data with compliant storage solutions across jurisdictions."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-background">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img src={techBg} alt="Tech Texture" className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Engineered for <span className="text-primary text-glow">Excellence</span>
          </h2>
          <p className="text-lg text-gray-400">
            Our technology stack is designed to meet the rigorous demands of modern enterprise environments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card glass-card-hover border-white/5 bg-white/5 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors border border-primary/20">
                  <feature.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
