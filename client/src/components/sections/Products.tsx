import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box, BarChart, MessageSquare, Layers, CheckCircle2, Shield, Brain, Cpu, Database, Globe, Zap, Cloud, Code, Settings, Rocket, LucideIcon, ExternalLink, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProducts } from "@/hooks/useProducts";
import { DemoModal } from "@/components/ui/DemoModal";

const iconMap: Record<string, LucideIcon> = {
  Box, BarChart, MessageSquare, Layers, Shield, Brain, Cpu, Database, Globe, Zap, Cloud, Code, Settings, Rocket,
};

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
}

export function Products() {
  const { products: dbProducts, isLoading } = useProducts();

  const displayProducts = dbProducts
    .filter(p => p.status === "active")
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  return (
    <section id="products" className="py-24 bg-gradient-to-b from-background to-[#0b1221]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Our <span className="text-primary text-glow">Solutions</span>
            </h2>
            <p className="text-lg text-gray-400">
              Discover our suite of AI-powered products designed to accelerate your digital transformation.
            </p>
          </div>
          <a href="#products">
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" data-testid="button-view-all-products">
              View All Products
            </Button>
          </a>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="glass-card border-white/5 bg-[#0f172a]/50 h-64 animate-pulse" />
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Box className="w-16 h-16 mx-auto mb-4 text-primary/30" />
            <p className="text-xl font-heading text-white/60">Products coming soon</p>
            <p className="text-sm mt-2">Our innovative solutions are being prepared for you.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {displayProducts.map((product, index) => {
              const IconComponent = iconMap[product.icon || "Box"] || Box;
              const tags = product.tagline ? product.tagline.split(",").map(t => t.trim()) : [];
              const features = product.features ? product.features.split(",").map(f => f.trim()) : [];

              return (
                <Card key={index} className="glass-card border-white/5 bg-[#0f172a]/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden" data-testid={`card-product-${index}`}>
                  <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none -mr-16 -mt-16" />

                  <CardHeader className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-white mb-2">{product.name}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      {tags.map(tag => (
                        <span key={tag} className="text-xs font-mono py-1 px-2 rounded bg-white/5 text-gray-400 border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {product.description}
                    </p>
                  </CardContent>
                  <CardFooter className="relative">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="p-0 text-primary hover:text-white hover:bg-transparent group-hover:translate-x-2 transition-all" data-testid={`button-view-details-${index}`}>
                          View Details <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card bg-[#0f172a]/95 border-primary/20 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <DialogTitle className="text-2xl font-bold font-heading">{product.name}</DialogTitle>
                          </div>
                          <DialogDescription className="text-gray-300 text-base leading-relaxed">
                            {product.description}
                          </DialogDescription>
                        </DialogHeader>

                        {product.videoUrl && (
                          <div className="mt-6">
                            {(() => {
                              const embedUrl = getYouTubeEmbedUrl(product.videoUrl);
                              if (embedUrl) {
                                return (
                                  <div className="relative w-full rounded-lg overflow-hidden border border-white/10" style={{ paddingBottom: "56.25%" }}>
                                    <iframe
                                      src={embedUrl}
                                      className="absolute inset-0 w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      title={`${product.name} video`}
                                    />
                                  </div>
                                );
                              }
                              return (
                                <a
                                  href={product.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors group"
                                  data-testid="link-product-video"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                    <Play className="w-5 h-5 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white">Watch Product Video</p>
                                    <p className="text-xs text-gray-400 truncate">{product.videoUrl}</p>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary shrink-0" />
                                </a>
                              );
                            })()}
                          </div>
                        )}

                        {features.length > 0 && (
                          <div className="mt-6 space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Key Features</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-8 flex justify-end gap-4 sticky bottom-0 bg-[#0f172a]/95 pt-4 pb-1">
                          <DemoModal trigger={
                            <Button className="bg-primary text-background font-bold hover:bg-primary/90" data-testid="button-request-demo-product">Request Demo</Button>
                          } />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
