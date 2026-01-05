import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box, BarChart, MessageSquare, Layers } from "lucide-react";

const products = [
  {
    icon: Box,
    title: "CogniFlow ERP",
    description: "Next-generation Enterprise Resource Planning driven by predictive AI analytics to optimize supply chains.",
    tags: ["Supply Chain", "AI Analytics"]
  },
  {
    icon: MessageSquare,
    title: "AutoSupport Bot",
    description: "Intelligent customer service automation that understands context, sentiment, and complex queries.",
    tags: ["NLP", "Automation"]
  },
  {
    icon: BarChart,
    title: "DataSense BI",
    description: "Business Intelligence platform that turns raw data into actionable strategic insights in real-time.",
    tags: ["Big Data", "Visualization"]
  },
  {
    icon: Layers,
    title: "SecureStack",
    description: "Full-stack security infrastructure wrapper protecting legacy systems from modern cyber threats.",
    tags: ["Cybersecurity", "Integration"]
  }
];

export function Products() {
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
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            View All Products
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <Card key={index} className="glass-card border-white/5 bg-[#0f172a]/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none -mr-16 -mt-16" />
              
              <CardHeader className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <product.icon className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">{product.title}</CardTitle>
                <div className="flex gap-2">
                  {product.tags.map(tag => (
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
                <Button variant="ghost" className="p-0 text-primary hover:text-white hover:bg-transparent group-hover:translate-x-2 transition-all">
                  View Details <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
