import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box, BarChart, MessageSquare, Layers, Shield, Brain, Cpu, Database, Globe, Zap, Cloud, Code, Settings, Rocket, LucideIcon } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useLocation } from "wouter";

const iconMap: Record<string, LucideIcon> = {
  Box, BarChart, MessageSquare, Layers, Shield, Brain, Cpu, Database, Globe, Zap, Cloud, Code, Settings, Rocket,
};

export function Products() {
  const { products: dbProducts, isLoading } = useProducts();
  const [, setLocation] = useLocation();

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

              return (
                <Card
                  key={product.id}
                  className="glass-card border-white/5 bg-[#0f172a]/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden cursor-pointer"
                  data-testid={`card-product-${index}`}
                  onClick={() => setLocation(`/products/${product.id}`)}
                >
                  <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none -mr-16 -mt-16" />

                  <CardHeader className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform overflow-hidden">
                      {product.logoUrl ? (
                        <img src={product.logoUrl} alt={product.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <IconComponent className="w-7 h-7 text-primary" />
                      )}
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
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors line-clamp-3">
                      {product.description}
                    </p>
                  </CardContent>
                  <CardFooter className="relative">
                    <Button
                      variant="ghost"
                      className="p-0 text-primary hover:text-white hover:bg-transparent group-hover:translate-x-2 transition-all"
                      data-testid={`button-view-details-${index}`}
                      onClick={e => { e.stopPropagation(); setLocation(`/products/${product.id}`); }}
                    >
                      View Details <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
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
