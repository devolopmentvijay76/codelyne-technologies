import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { JarvisLogo } from "@/components/ui/JarvisLogo";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Founders", href: "/founders" },
    { name: "Products", href: "/#products" },
    { name: "About Us", href: "/about-us" },
    { name: "Solutions", href: "/#features" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-white/10 bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-4 group">
            <JarvisLogo size="md" />
            
            <span className="text-lg md:text-xl font-heading font-bold tracking-wide text-white group-hover:text-primary transition-colors">
              CODELYNE <span className="text-primary font-extrabold">TECHNOLOGIES</span>
            </span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-primary transition-colors hover:text-glow"
              data-testid={`nav-link-${link.name.toLowerCase()}`}
            >
              {link.name}
            </a>
          ))}
          <Button 
            className="bg-primary hover:bg-primary/90 text-background font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300"
            data-testid="btn-get-demo"
          >
            Get 24-Hour Demo
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white hover:text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-gray-300 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Button className="w-full bg-primary text-background font-bold mt-4">
            Get 24-Hour Demo
          </Button>
        </div>
      )}
    </nav>
  );
}
