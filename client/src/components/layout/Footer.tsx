import { MapPin, Phone, Mail, Linkedin, Twitter, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { JarvisLogo } from "@/components/ui/JarvisLogo";

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <JarvisLogo size="sm" />
              <span className="text-lg font-heading font-bold text-white">CODELYNE TECHNOLOGIES</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pioneering AI-driven software solutions for the enterprise of tomorrow. Building trust through technical excellence.
            </p>
          </div>

          {/* Contact Info */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-white font-heading font-semibold mb-4">Contact Us</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <address className="not-italic text-sm leading-relaxed">
                  <strong>Vyasa House</strong>,<br />
                  Sr No: 23, Near 19 Grand West Society,<br />
                  Aditya Birla Hospital Road,<br />
                  Dange Chowk Rd, Thergaon,<br />
                  Pimpri-Chinchwad, Maharashtra – 411033
                </address>
              </div>
              <div className="space-y-3">
                <a href="tel:+919922844271" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                  +91 99228 44271
                </a>
                <a href="mailto:kadamatulp@gmail.com" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                  kadamatulp@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Social & Links */}
          <div className="space-y-4">
            <h3 className="text-white font-heading font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Codelyne Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
