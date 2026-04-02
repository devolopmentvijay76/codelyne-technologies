import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, CheckCircle2, Play, ExternalLink, Zap, Building2, Send,
  Box, BarChart, MessageSquare, Layers, Shield, Brain, Cpu, Database,
  Globe, Cloud, Code, Settings, Rocket, Bot, Network, Star, ChevronRight,
  Phone, Mail, LucideIcon
} from "lucide-react";
import type { Product } from "@shared/schema";

const iconMap: Record<string, LucideIcon> = {
  Box, BarChart, MessageSquare, Layers, Shield, Brain, Cpu, Database,
  Globe, Zap, Cloud, Code, Settings, Rocket, Bot, Network,
};

const domainIcons: Record<string, LucideIcon> = {
  FinTech: Building2,
  Finance: Building2,
  HealthTech: Shield,
  Health: Shield,
  Manufacturing: Settings,
  Retail: Box,
  Education: Code,
  Logistics: Globe,
  Government: Building2,
  Telecom: Network,
  Insurance: Shield,
  "E-Commerce": Rocket,
  "Real Estate": Building2,
  Media: Star,
};

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1&showinfo=0`;
  }
  return null;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    },
    enabled: !!id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          subject: `Product Inquiry: ${product?.name}`,
          type: "product_inquiry",
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      toast({ title: "Inquiry Sent!", description: "Our team will get back to you within 24 hours." });
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch {
      toast({ title: "Failed to send", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-white font-heading mb-4">Product not found</p>
          <Button onClick={() => setLocation("/")} className="bg-primary text-background">Go Home</Button>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[product.icon || "Box"] || Box;
  const features = product.features ? product.features.split(",").map(f => f.trim()).filter(Boolean) : [];
  const uspList = product.usp ? product.usp.split("|").map(u => u.trim()).filter(Boolean) : [];
  const domainList = product.domains ? product.domains.split(",").map(d => d.trim()).filter(Boolean) : [];
  const embedUrl = product.videoUrl ? getYouTubeEmbedUrl(product.videoUrl) : null;
  const tags = product.tagline ? product.tagline.split(",").map(t => t.trim()) : [];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-8 text-gray-400 hover:text-primary hover:bg-transparent -ml-2"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Badge
                  className={product.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/30" :
                    product.status === "coming_soon" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" :
                      "bg-gray-500/10 text-gray-400 border-gray-500/30"}
                >
                  {product.status === "active" ? "Live & Available" : product.status === "coming_soon" ? "Coming Soon" : "Inactive"}
                </Badge>
              </div>

              <div className="flex items-start gap-5 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/30 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(6,182,212,0.2)] overflow-hidden">
                  {product.logoUrl ? (
                    <img src={product.logoUrl} alt={product.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <IconComponent className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight" data-testid="text-product-name">
                    {product.name}
                  </h1>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map(tag => (
                      <span key={tag} className="text-xs font-mono py-1 px-2 rounded bg-white/5 text-gray-400 border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-300 leading-relaxed mb-8" data-testid="text-product-description">
                {product.description}
              </p>

              <div className="flex gap-4">
                <a href="#inquire">
                  <Button className="bg-primary text-background font-bold hover:bg-primary/90 px-6" data-testid="button-inquire-product">
                    <Mail className="w-4 h-4 mr-2" /> Inquire Now
                  </Button>
                </a>
                {product.videoUrl && (
                  <a href="#video">
                    <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10" data-testid="button-watch-video">
                      <Play className="w-4 h-4 mr-2" /> Watch Demo
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* USP Cards */}
            {uspList.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {uspList.map((usp, i) => (
                  <div
                    key={i}
                    className="glass-card p-5 rounded-xl border border-primary/20 hover:border-primary/40 transition-all group"
                    data-testid={`card-usp-${i}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm text-white font-medium leading-snug">{usp}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Section */}
      {product.videoUrl && (
        <section id="video" className="py-16 bg-gradient-to-b from-background to-[#0a0f1e]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Product Demo</Badge>
                <h2 className="text-3xl font-heading font-bold text-white">See {product.name} in Action</h2>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden border border-primary/20 shadow-[0_0_60px_rgba(6,182,212,0.1)]">
                {embedUrl ? (
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      src={embedUrl}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="eager"
                      title={`${product.name} demo video`}
                      data-testid="video-product-demo"
                    />
                  </div>
                ) : (
                  <a
                    href={product.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-4 py-20 hover:bg-white/5 transition-colors group"
                    data-testid="link-product-video-external"
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-10 h-10 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold text-lg">Watch Demo Video</p>
                      <p className="text-gray-400 text-sm mt-1 flex items-center gap-1 justify-center">
                        Opens in new tab <ExternalLink className="w-3 h-3" />
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {features.length > 0 && (
        <section className="py-16 bg-[#0a0f1e]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Capabilities</Badge>
              <h2 className="text-3xl font-heading font-bold text-white">Key Features</h2>
              <p className="text-gray-400 mt-2">Everything you need to transform your business</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="glass-card p-5 rounded-xl border border-white/5 hover:border-primary/30 transition-all group flex items-start gap-3"
                  data-testid={`card-feature-${i}`}
                >
                  <div className="mt-0.5 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Domains Section */}
      {domainList.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-[#0a0f1e] to-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Industries</Badge>
              <h2 className="text-3xl font-heading font-bold text-white">Where It Can Be Implemented</h2>
              <p className="text-gray-400 mt-2 max-w-xl mx-auto">
                {product.name} is designed to scale across multiple industries and verticals
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              {domainList.map((domain, i) => {
                const DomainIcon = domainIcons[domain] || Building2;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-5 py-3 glass-card rounded-xl border border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-default"
                    data-testid={`badge-domain-${i}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                      <DomainIcon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-white font-medium text-sm">{domain}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact / Inquiry Section */}
      <section id="inquire" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left: Info */}
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Get In Touch</Badge>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                  Interested in <span className="text-primary">{product.name}</span>?
                </h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Fill out the form and our team will reach out within 24 hours with a personalized demo and pricing tailored to your business.
                </p>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Email Us</p>
                      <a href="mailto:support@codelynetechnologies.com" className="text-gray-400 text-sm hover:text-primary transition-colors">
                        support@codelynetechnologies.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Call Us</p>
                      <a href="tel:+919922844271" className="text-gray-400 text-sm hover:text-primary transition-colors">
                        +91 99228 44271
                      </a>
                    </div>
                  </div>

                  <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/15">
                    <div className="flex items-center gap-2 mb-2">
                      <ChevronRight className="w-4 h-4 text-primary" />
                      <span className="text-white font-medium text-sm">What happens next?</span>
                    </div>
                    <ul className="space-y-1 text-xs text-gray-400 ml-6">
                      <li>• Our team reviews your inquiry within 2 hours</li>
                      <li>• We schedule a personalized demo session</li>
                      <li>• You receive a custom pricing proposal</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <div className="glass-card p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-heading font-bold text-white mb-6">Request a Demo</h3>
                <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-product-inquiry">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm">Full Name *</Label>
                      <Input
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="John Smith"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                        data-testid="input-inquiry-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm">Company</Label>
                      <Input
                        value={form.company}
                        onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                        placeholder="Your Company"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                        data-testid="input-inquiry-company"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm">Email *</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="john@company.com"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                        data-testid="input-inquiry-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm">Phone</Label>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 99999 99999"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                        data-testid="input-inquiry-phone"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Message *</Label>
                    <Textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder={`Tell us about your requirements for ${product.name}...`}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 min-h-[120px]"
                      data-testid="input-inquiry-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-background font-bold hover:bg-primary/90 h-12"
                    data-testid="button-submit-inquiry"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-background/50 border-t-background rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" /> Send Inquiry
                      </span>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">We'll respond within 24 hours. No spam, ever.</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </div>
  );
}
