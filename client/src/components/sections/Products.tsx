import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box, BarChart, MessageSquare, Layers, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const products = [
  {
    icon: Box,
    title: "CogniFlow ERP",
    description: "Next-generation Enterprise Resource Planning driven by predictive AI analytics to optimize supply chains.",
    tags: ["Supply Chain", "AI Analytics"],
    fullDescription: "CogniFlow ERP redefines enterprise resource planning by integrating deep learning models that predict supply chain disruptions before they happen. Our system autonomously adjusts inventory levels, optimizes logistics routes, and reduces operational overhead by up to 40%.",
    features: [
      "Predictive Inventory Management",
      "Automated Supplier Negotiations",
      "Real-time Logistics Tracking",
      "Demand Forecasting"
    ]
  },
  {
    icon: MessageSquare,
    title: "AutoSupport Bot",
    description: "Intelligent customer service automation that understands context, sentiment, and complex queries.",
    tags: ["NLP", "Automation"],
    fullDescription: "AutoSupport Bot isn't just a chatbot; it's a cognitive agent capable of handling Tier-1 and Tier-2 support queries with human-like empathy and precision. Utilizing advanced NLP, it understands intent, detects sentiment, and resolves issues autonomously.",
    features: [
      "Sentiment Analysis Engine",
      "Multi-language Support (100+)",
      "CRM Integration",
      "Voice & Text Capable"
    ]
  },
  {
    icon: BarChart,
    title: "DataSense BI",
    description: "Business Intelligence platform that turns raw data into actionable strategic insights in real-time.",
    tags: ["Big Data", "Visualization"],
    fullDescription: "DataSense BI connects to your disparate data sources to create a unified truth. Our AI engine identifies hidden patterns and correlations, generating executive dashboards that tell a story, not just show numbers.",
    features: [
      "Real-time Data Streaming",
      "Customizable Dashboards",
      "Anomaly Detection",
      "Automated Reporting"
    ]
  },
  {
    icon: Layers,
    title: "SecureStack",
    description: "Full-stack security infrastructure wrapper protecting legacy systems from modern cyber threats.",
    tags: ["Cybersecurity", "Integration"],
    fullDescription: "SecureStack wraps your existing legacy infrastructure in a modern, AI-driven security layer. It detects Zero-Day vulnerabilities and neutralizes threats in microseconds, ensuring your heritage systems remain secure in a modern threat landscape.",
    features: [
      "Zero-Trust Architecture",
      "Legacy System Wrapper",
      "Real-time Threat Neutralization",
      "Compliance Auditing"
    ]
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="p-0 text-primary hover:text-white hover:bg-transparent group-hover:translate-x-2 transition-all">
                      View Details <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card bg-[#0f172a]/95 border-primary/20 text-white max-w-2xl">
                    <DialogHeader>
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center">
                           <product.icon className="w-6 h-6 text-primary" />
                         </div>
                         <DialogTitle className="text-2xl font-bold font-heading">{product.title}</DialogTitle>
                      </div>
                      <DialogDescription className="text-gray-300 text-base leading-relaxed">
                        {product.fullDescription}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mt-6 space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Key Features</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {product.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end gap-4">
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Close</Button>
                      <Button className="bg-primary text-background font-bold hover:bg-primary/90">Request Demo</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
