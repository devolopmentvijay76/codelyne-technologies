"use client";

import { MessageCircle, Bot, X, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const COMPANY_KEYWORDS = [
  "product", "products", "demo", "contact", "email", "phone", "location",
  "address", "office", "founder", "ceo", "team", "service", "services",
  "price", "pricing", "cost", "codelyne", "ai", "erp", "support", "sales",
  "technology", "software", "solution", "solutions", "enterprise", "client",
  "clients", "project", "projects", "engineer", "engineering", "about",
  "vision", "mission", "career", "careers", "hire", "hiring", "partner",
  "partnership", "integration", "cloud", "data", "analytics", "automation",
  "cogniflow", "autosupport", "datasense", "securestack", "whatsapp", "help",
  "schedule", "appointment", "consult", "consultation"
];

const OFF_TOPIC_KEYWORDS = [
  "personal", "private", "family", "married", "age", "salary", "salary",
  "girlfriend", "boyfriend", "wife", "husband", "children", "kids", "home",
  "religion", "politics", "sport", "sports", "movie", "movies", "music",
  "game", "games", "weather", "news", "joke", "jokes", "recipe", "food",
  "travel", "vacation", "holiday", "school", "college", "university", "degree",
  "health", "doctor", "medicine", "horoscope", "astrology", "celebrity"
];

function isCompanyRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return COMPANY_KEYWORDS.some(kw => lower.includes(kw));
}

function isOffTopic(text: string): boolean {
  const lower = text.toLowerCase();
  return OFF_TOPIC_KEYWORDS.some(kw => lower.includes(kw));
}

function getBotResponse(text: string): string {
  const lower = text.toLowerCase();

  if (isOffTopic(text) && !isCompanyRelated(text)) {
    return "I'm only able to assist with questions about Codelyne Technologies — our products, services, team, or how to get in touch. Is there something company-related I can help you with?";
  }

  if (!isCompanyRelated(text)) {
    return "I'm the Codelyne AI Assistant and I'm here to help with questions about our company, products, and services. Could you ask me something about Codelyne?";
  }

  if (lower.includes("cogniflow") || (lower.includes("erp"))) {
    return "CogniFlow ERP is our AI-driven Enterprise Resource Planning platform featuring predictive inventory management, automated supplier negotiations, real-time logistics tracking, and demand forecasting. Would you like to schedule a demo?";
  }

  if (lower.includes("autosupport") || (lower.includes("bot") && lower.includes("support"))) {
    return "AutoSupport Bot is our intelligent customer service automation solution with sentiment analysis, 100+ language support, CRM integration, and voice & text capabilities. Want to know more?";
  }

  if (lower.includes("datasense") || lower.includes("bi") || lower.includes("business intelligence")) {
    return "DataSense BI is our Business Intelligence platform offering real-time data streaming, customizable dashboards, anomaly detection, and automated reporting. Shall I schedule a demo for you?";
  }

  if (lower.includes("securestack") || lower.includes("security") || lower.includes("cybersecurity")) {
    return "SecureStack is our cybersecurity solution with zero-trust architecture, legacy system wrapping, real-time threat neutralization, and compliance auditing. Would you like more details?";
  }

  if (lower.includes("product")) {
    return "We offer AI-powered enterprise products: CogniFlow ERP, AutoSupport Bot, DataSense BI, and SecureStack. Which one would you like to know more about?";
  }

  if (lower.includes("demo") || lower.includes("schedule") || lower.includes("appointment")) {
    return "I can help you request a 24-hour demo! Please click the 'Request 24-Hour Demo' button above or fill out the contact form. Our team will get back to you promptly.";
  }

  if (lower.includes("contact") || lower.includes("email") || lower.includes("phone")) {
    return "You can reach us at support@codelynetechnologies.com or call +91 99228 44271. You can also use the contact form on our website.";
  }

  if (lower.includes("location") || lower.includes("address") || lower.includes("office")) {
    return "Our office is at Vyasa House, Sr No: 23, Aditya Birla Hospital Road, Dange Chowk Rd, Thergaon, Pimpri-Chinchwad, Maharashtra – 411033. Find us on Google Maps via the footer link!";
  }

  if (lower.includes("founder") || lower.includes("ceo") || lower.includes("leadership")) {
    return "Codelyne Technologies was founded by Atul Kadam (Founder & CEO), Hemant Nagrale (Co-Founder & Strategic Advisor), and Nilima Shitole (Co-Founder & Head of Management). Visit our Founders page to learn more!";
  }

  if (lower.includes("team") || lower.includes("engineer") || lower.includes("staff")) {
    return "We have a talented team of AI engineers, full-stack developers, project managers, and QA specialists. Visit our About page to meet the full team!";
  }

  if (lower.includes("price") || lower.includes("cost") || lower.includes("pricing")) {
    return "Our pricing is customized based on your specific requirements and scale. Please contact our sales team or request a demo for a tailored quote.";
  }

  if (lower.includes("service") || lower.includes("solution")) {
    return "Codelyne offers AI-first enterprise software solutions including ERP, customer support automation, business intelligence, and cybersecurity. Shall I tell you more about any specific service?";
  }

  if (lower.includes("career") || lower.includes("job") || lower.includes("hiring") || lower.includes("hire")) {
    return "Interested in joining Codelyne Technologies? We're always looking for talented engineers and professionals. Please email your resume to support@codelynetechnologies.com.";
  }

  if (lower.includes("whatsapp")) {
    return "You can reach us instantly on WhatsApp! Click the green WhatsApp button on this page to start a chat with us directly.";
  }

  if (lower.includes("about") || lower.includes("company") || lower.includes("codelyne")) {
    return "Codelyne Technologies is an AI-driven software and product engineering company headquartered in Pune, India. We build enterprise-grade AI solutions for businesses across industries.";
  }

  if (lower.includes("mission") || lower.includes("vision")) {
    return "Our mission is to pioneer AI-driven software solutions that transform how enterprises operate. We believe technology should think, learn, and evolve — not just automate.";
  }

  return "Thank you for reaching out! For detailed assistance, our team is available at support@codelynetechnologies.com or +91 99228 44271. You can also request a demo or fill the contact form.";
}

export function FloatingActions() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I'm the Codelyne AI Assistant. I can help you with questions about our products, services, team, or how to get in touch. How can I assist you?" }
  ]);
  const [input, setInput] = useState("");

  const quickPrompts = [
    "Explore Products",
    "Book Demo",
    "Talk to Sales"
  ];

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");

    setTimeout(() => {
      const response = getBotResponse(text);
      setMessages(prev => [...prev, { role: "bot", content: response }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919922844271"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group"
        title="Chat on WhatsApp"
        data-testid="link-whatsapp"
      >
        <MessageCircle className="w-8 h-8 text-white fill-white" />
        <span className="absolute right-16 bg-white text-black px-3 py-1 rounded text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          WhatsApp Us
        </span>
      </a>

      {/* Chatbot Toggle */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-110 transition-transform duration-300 group relative"
        data-testid="button-chatbot-toggle"
      >
        {isChatOpen ? <X className="w-7 h-7 text-background" /> : <Bot className="w-7 h-7 text-background" />}
        <span className="absolute right-0 top-0 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-background" />
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] h-[500px] glass-card rounded-2xl border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-primary/10 p-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Codelyne Assistant</h4>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Online
              </p>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] rounded-2xl p-3 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-background font-medium rounded-tr-none"
                      : "bg-white/10 text-gray-200 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-white/10 bg-background/50">
            {messages.length === 1 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-none">
                {quickPrompts.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-xs border border-primary/30 text-primary px-3 py-1 rounded-full hover:bg-primary/10 transition-colors whitespace-nowrap"
                    data-testid={`button-quick-prompt-${prompt.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about our products or services..."
                className="bg-white/5 border-white/10 text-white pr-10 focus:border-primary/50 rounded-xl"
                data-testid="input-chat-message"
              />
              <button
                onClick={() => handleSend()}
                className="absolute right-2 top-2 text-primary hover:text-white transition-colors"
                data-testid="button-chat-send"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
