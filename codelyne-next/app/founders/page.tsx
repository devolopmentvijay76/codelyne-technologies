import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import { Brain, Rocket, Users, Target, ShieldCheck, Zap, Layers, Lightbulb } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const ATUL_IMG = "/attached_assets/generated_images/professional_portrait_of_atul_kadam%2C_founder_%26_ceo.png";
const HEMANT_IMG = "/attached_assets/generated_images/professional_portrait_of_hemant_nagrale%2C_co-founder.png";
const NILIMA_IMG = "/attached_assets/generated_images/professional_portrait_of_nilima_shitole%2C_co-founder.png";
const HERO_BG = "/attached_assets/generated_images/abstract_neural_network_background%2C_deep_blue_and_cyan_connection_lines.png";

const founders = [
  {
    name: "Atul Kadam",
    title: "Founder & CEO",
    image: ATUL_IMG,
    quote: "Technology should not just automate tasks — it should think, learn, and evolve. At Codelyne Technologies, we engineer intelligence at the core.",
    description: "As the chief architect of AI-first platforms, Atul leads the long-term vision, innovation, and R&D at Codelyne Technologies. He specializes in designing scalable, secure, enterprise-grade architectures with deep expertise in AI, ML, full-stack development, and cloud systems.",
    focusAreas: ["AI Architecture", "Product Engineering", "System Design", "Innovation Strategy"],
    icon: Brain,
  },
  {
    name: "Hemant Nagrale",
    title: "Co-Founder",
    image: HEMANT_IMG,
    quote: "Great products emerge when business clarity meets strong engineering. Our focus is building platforms that scale with purpose.",
    description: "Hemant leads product strategy and market alignment, converting complex business problems into scalable digital platforms. He oversees partnerships, growth strategy, and client success, bridging engineering execution with tangible business outcomes.",
    focusAreas: ["Product Strategy", "Business Growth", "Market Expansion", "Client Alignment"],
    icon: Rocket,
  },
  {
    name: "Nilima Shitole",
    title: "Co-Founder & Head of Management",
    image: NILIMA_IMG,
    quote: "Strong systems require strong people, processes, and governance. Sustainable growth begins with disciplined execution.",
    description: "Nilima leads organizational structure, HR strategy, and governance. She ensures operational excellence, compliance, and stability, building high-performance teams and scalable internal processes for long-term sustainability.",
    focusAreas: ["Organizational Management", "Human Resources", "Operations & Governance", "Process Optimization"],
    icon: Users,
  },
];

const philosophyPoints = [
  { icon: Layers, title: "AI-native, not AI-added", text: "Intelligence is built into our core, not an afterthought." },
  { icon: Lightbulb, title: "Product-led Innovation", text: "We solve real problems with tangible, scalable products." },
  { icon: Zap, title: "Speed with Discipline", text: "Rapid execution backed by solid architectural foundations." },
  { icon: Target, title: "Long-term Value", text: "We prioritize enduring quality over short-term trends." },
];

const trustFactors = [
  { title: "Deep Technical Ownership", desc: "Founders who code and architect." },
  { title: "Clear Decision Making", desc: "Agile leadership without bureaucracy." },
  { title: "Strong Governance", desc: "Disciplined operations from day one." },
  { title: "Accountability", desc: "Direct commitment to client success." },
];

export default function FoundersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ProtectedImage src={HERO_BG} alt="Background" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            The Founders Behind <span className="text-primary text-glow">Codelyne Technologies</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Engineering Intelligence Through Vision, Technology, and Leadership.
          </p>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="container mx-auto px-6 space-y-32">
          {founders.map((founder, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
              <div className="w-full lg:w-1/3 relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-card">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <ProtectedImage src={founder.image} alt={founder.name} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                    <founder.icon className="w-8 h-8 text-primary mb-2" />
                    <h3 className="text-2xl font-bold text-white">{founder.name}</h3>
                    <p className="text-primary font-medium">{founder.title}</p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-2/3 space-y-8">
                <div className="relative">
                  <span className="text-6xl text-primary/10 font-serif absolute -top-8 -left-4">“</span>
                  <blockquote className="text-2xl md:text-3xl font-heading font-medium text-white leading-tight pl-6 border-l-4 border-primary/50 italic">
                    {founder.quote}
                  </blockquote>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed">
                  {founder.description}
                </p>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">Focus Areas</h4>
                  <div className="flex flex-wrap gap-3">
                    {founder.focusAreas.map((area) => (
                      <Badge key={area} variant="secondary" className="bg-white/5 hover:bg-primary/20 text-gray-300 hover:text-primary transition-colors border-white/5 px-4 py-2 text-sm">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Three Founders. <span className="text-primary">One Vision.</span></h2>
            <p className="text-xl text-gray-400 italic">&quot;We don&apos;t chase trends. We build intelligent foundations.&quot;</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {philosophyPoints.map((point, i) => (
              <Card key={i} className="bg-background/50 border-white/10 hover:border-primary/50 transition-colors group">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <point.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{point.title}</h3>
                </CardHeader>
                <CardContent className="text-center text-gray-400">
                  {point.text}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-8">
                Why <span className="text-primary text-glow">Founder-Led</span> Matters
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                In an era of rapid AI evolution, having founders who deeply understand both the technology and the business landscape ensures stability, trust, and continuous innovation.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {trustFactors.map((factor, i) => (
                  <div key={i} className="flex gap-4">
                    <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold text-white">{factor.title}</h4>
                      <p className="text-sm text-gray-400">{factor.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Leadership That Builds</h3>
              <p className="text-gray-300 mb-8">
                Under founder leadership, Codelyne Technologies is actively building:
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  AI-first enterprise platforms
                </li>
                <li className="flex items-center gap-3 text-white">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  SaaS products with global scalability
                </li>
                <li className="flex items-center gap-3 text-white">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Long-term AI infrastructure systems
                </li>
              </ul>
              <Button className="w-full bg-white text-background hover:bg-gray-200 font-bold">
                Explore Our Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 text-center bg-gradient-to-b from-transparent to-[#050a14]">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-12 leading-tight">
            “Codelyne Technologies is built to engineer intelligence, empower businesses, and scale trust in the AI-driven world.”
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button size="lg" className="bg-primary text-background hover:bg-primary/90 font-bold px-8 h-14 text-lg">
              Talk to Our Founders
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 text-lg">
              Request a 24-Hour Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
