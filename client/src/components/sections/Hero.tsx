import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu, Network } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_neural_network_background,_deep_blue_and_cyan_connection_lines.png";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="AI Neural Network Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Floating Elements Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
            <Cpu className="w-4 h-4" />
            <span>Next-Gen Enterprise AI Solutions</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight" data-testid="hero-headline">
            Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 text-glow">Intelligent</span> Future
          </h1>
          
          <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
            Codelyne Technologies engineers enterprise-grade software infused with advanced artificial intelligence. Secure, scalable, and future-ready.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-background font-bold h-14 px-8 text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-300"
              data-testid="btn-hero-demo"
            >
              Get 24-Hour Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white h-14 px-8 text-lg backdrop-blur-sm"
              data-testid="btn-hero-explore"
            >
              Explore Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Right Side Visual */}
        <div className="relative hidden md:flex justify-center items-center animate-in slide-in-from-right-10 fade-in duration-1000">
          <div className="relative w-full max-w-lg aspect-square">
            {/* Central Holographic UI Element - CSS constructed */}
            <div className="absolute inset-0 border border-primary/30 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-8 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-16 border border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-card p-8 rounded-2xl w-64 h-64 flex flex-col items-center justify-center text-center gap-4 relative z-20 border-primary/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                 <Network className="w-16 h-16 text-primary animate-pulse" />
                 <h3 className="text-2xl font-heading font-bold text-white">Neural Core</h3>
                 <p className="text-sm text-gray-400">Processing real-time enterprise data streams</p>
              </div>
            </div>

            {/* Orbiting nodes */}
            <div className="absolute top-0 left-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(6,182,212,1)]" />
            <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,1)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
