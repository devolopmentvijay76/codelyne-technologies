"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import { Target, Lightbulb, ArrowDown, Brain, Rocket, Users } from "lucide-react";
import { usePublicTeam } from "@/hooks/usePublicTeam";

const iconMap: Record<string, any> = {
  "Atul Kadam": Brain,
  "Hemant Nagrale": Rocket,
  "Nilima Shitole": Users,
};

export default function AboutUsPage() {
  const { founders, management, engineers, admins, isLoading } = usePublicTeam();

  const teamMembers = [...management, ...engineers, ...admins];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden bg-[#0b0f19]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">Who We Are</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            About <span className="text-primary text-glow">Codelyne Technologies</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            AI-Driven Engineering. Founder-Led Innovation. Scalable Execution.
          </p>
          <div className="mt-12 flex justify-center animate-bounce">
            <ArrowDown className="w-6 h-6 text-primary/50" />
          </div>
        </div>
      </section>

      <section className="py-20 relative border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
              The Founders Behind <span className="text-primary">Codelyne</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Engineering Intelligence Through Vision, Technology, and Leadership.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-gray-400">Loading founders...</div>
          ) : (
            <div className="space-y-32">
              {founders.map((founder, index) => {
                const IconComponent = iconMap[founder.name] || Brain;
                const focusAreasArray = founder.focusAreas?.split(",").map(a => a.trim()) || [];

                return (
                  <div key={founder.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
                    <div className="w-full lg:w-1/3 relative group">
                      <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-card">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                        {founder.photoUrl ? (
                          <ProtectedImage src={founder.photoUrl} alt={founder.name} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full aspect-square bg-gray-800 flex items-center justify-center">
                            <IconComponent className="w-24 h-24 text-primary/30" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                          <IconComponent className="w-8 h-8 text-primary mb-2" />
                          <h3 className="text-2xl font-bold text-white">{founder.name}</h3>
                          <p className="text-primary font-medium">{founder.role}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-2/3 space-y-8">
                      {founder.quote && (
                        <div className="relative">
                          <span className="text-6xl text-primary/10 font-serif absolute -top-8 -left-4">&quot;</span>
                          <blockquote className="text-2xl md:text-3xl font-heading font-medium text-white leading-tight pl-6 border-l-4 border-primary/50 italic">
                            {founder.quote}
                          </blockquote>
                        </div>
                      )}

                      {founder.description && (
                        <p className="text-lg text-gray-300 leading-relaxed">
                          {founder.description}
                        </p>
                      )}

                      {focusAreasArray.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">Focus Areas</h4>
                          <div className="flex flex-wrap gap-3">
                            {focusAreasArray.map((area) => (
                              <Badge key={area} variant="secondary" className="bg-white/5 hover:bg-primary/20 text-gray-300 hover:text-primary transition-colors border-white/5 px-4 py-2 text-sm">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 relative bg-[#0b0f19]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Our Team Hierarchy</h2>
            <p className="text-gray-400">The dedicated professionals driving our success.</p>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-gray-400">Loading team...</div>
          ) : (
            <div className="space-y-16">
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-blue-400 uppercase tracking-widest text-center">Core Team</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="group bg-white/5 border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                      <div className="aspect-square overflow-hidden bg-gray-900/50">
                        {member.photoUrl ? (
                          <ProtectedImage src={member.photoUrl} alt={member.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <Users className="w-16 h-16 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-white mb-1">{member.name}</h4>
                        <p className="text-sm text-gray-400 mb-2">{member.role}</p>
                        <Badge variant="secondary" className="bg-white/5 text-gray-500 text-xs">
                          {member.department}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-xl"><Lightbulb className="w-8 h-8 text-primary" /></div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">Our Vision</h2>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed">
                To become a globally trusted AI-first technology company building intelligent platforms that power enterprises, institutions, and digital economies.
              </p>
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">What This Means</h4>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start gap-3"><span className="text-primary mt-1">-</span>AI-native architecture in every product we build</li>
                  <li className="flex items-start gap-3"><span className="text-primary mt-1">-</span>Enterprise-grade security and compliance at core</li>
                  <li className="flex items-start gap-3"><span className="text-primary mt-1">-</span>Global partnerships with institutions and governments</li>
                  <li className="flex items-start gap-3"><span className="text-primary mt-1">-</span>Platforms that scale from startups to national systems</li>
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-xl"><Target className="w-8 h-8 text-primary" /></div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed">
                To design and deliver robust, scalable, and AI-native software products with speed, clarity, and long-term value.
              </p>
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">Our Commitment</h4>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start gap-3"><span className="text-primary mt-1">-</span>Engineering excellence over shortcuts</li>
                  <li className="flex items-start gap-3"><span className="text-primary mt-1">-</span>Clear communication and transparent delivery</li>
                  <li className="flex items-start gap-3"><span className="text-primary mt-1">-</span>Products built for long-term scalability</li>
                  <li className="flex items-start gap-3"><span className="text-primary mt-1">-</span>Continuous innovation through R&amp;D investment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
