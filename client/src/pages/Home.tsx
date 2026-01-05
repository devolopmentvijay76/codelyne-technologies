import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Products } from "@/components/sections/Products";
import { Contact } from "@/components/sections/Contact";
import { FloatingActions } from "@/components/ui/FloatingActions";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <Hero />
      <Features />
      <Products />
      <Contact />
      <Footer />
      <FloatingActions />
    </div>
  );
}
