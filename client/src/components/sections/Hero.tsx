import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu, Network, ShieldCheck, Globe, Database } from "lucide-react";
import heroVideo from "@assets/generated_videos/abstract_ai_neural_network_background_video.mp4";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DemoModal } from "@/components/ui/DemoModal";

const slides = [
  {
    icon: Cpu,
    title: "Building the Intelligent Future",
    subtitle: "Next-Gen Enterprise AI Solutions",
    description: "Codelyne Technologies engineers enterprise-grade software infused with advanced artificial intelligence. Secure, scalable, and future-ready.",
    cta: "Get 24-Hour Demo",
    highlight: "Intelligent"
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-Grade Security",
    subtitle: "Uncompromised Protection",
    description: "Bank-grade encryption and advanced threat detection protocols ensure your proprietary data remains sovereign and secure at all times.",
    cta: "Secure Your Data",
    highlight: "Security"
  },
  {
    icon: Globe,
    title: "Global Scalability",
    subtitle: "Boundless Infrastructure",
    description: "Cloud-native architectures designed to grow with your business, handling millions of requests with near-zero latency worldwide.",
    cta: "Explore Infrastructure",
    highlight: "Scalability"
  },
  {
    icon: Database,
    title: "Industry Specific Solutions",
    subtitle: "FinTech • HealthTech • Manufacturing",
    description: "Tailored AI modules for your specific industry needs. From predictive maintenance in manufacturing to fraud detection in finance.",
    cta: "View Domains",
    highlight: "Solutions"
  }
];

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Floating Elements Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Carousel Content */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 space-y-8 pl-4">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm animate-in slide-in-from-left-5 fade-in duration-500">
                   <slide.icon className="w-4 h-4" />
                   <span>{slide.subtitle}</span>
                 </div>
                 
                 <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
                   {slide.title.replace(slide.highlight, "")} 
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 text-glow">
                     {slide.highlight}
                   </span>
                 </h1>
                 
                 <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                   {slide.description}
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-4">
                   <DemoModal trigger={
                     <Button 
                       size="lg" 
                       className="bg-primary hover:bg-primary/90 text-background font-bold h-14 px-8 text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-300"
                       data-testid="button-hero-demo"
                     >
                       {slide.cta}
                     </Button>
                   } />
                   <Button 
                     size="lg" 
                     variant="outline" 
                     className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white h-14 px-8 text-lg backdrop-blur-sm"
                     onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                     data-testid="button-explore-products"
                   >
                     Explore Products
                     <ArrowRight className="ml-2 w-5 h-5" />
                   </Button>
                 </div>
              </div>
            ))}
          </div>
          
          {/* Carousel Dots */}
          <div className="flex gap-2 mt-8 pl-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === selectedIndex ? "bg-primary w-8" : "bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Side Visual - Consistent across slides but could be dynamic */}
        <div className="relative hidden md:flex justify-center items-center animate-in slide-in-from-right-10 fade-in duration-1000">
          <div className="relative w-full max-w-lg aspect-square">
            {/* Central Holographic UI Element - CSS constructed */}
            <div className="absolute inset-0 border border-primary/30 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-8 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-16 border border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-card p-8 rounded-2xl w-64 h-64 flex flex-col items-center justify-center text-center gap-4 relative z-20 border-primary/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-xl">
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
