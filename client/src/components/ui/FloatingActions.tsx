import { MessageCircle, Bot, X, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I'm the Codelyne AI Assistant. How can I help you today?" }
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
      let response = "Thank you for your interest. A human specialist will assist you shortly.";
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes("product")) {
        response = "Our products include CogniFlow ERP, AutoSupport Bot, and more. Would you like details on a specific one?";
      } else if (lowerText.includes("demo")) {
        response = "I can help you schedule a 24-hour demo. Please click the 'Request 24-Hour Demo' button or fill the contact form with your details.";
      } else if (lowerText.includes("contact") || lowerText.includes("email") || lowerText.includes("phone")) {
        response = "You can reach us at support@codelynetechnologies.com or call +91 99228 44271. You can also use the contact form on our website.";
      } else if (lowerText.includes("location") || lowerText.includes("address") || lowerText.includes("office")) {
        response = "Our office is located at Vyasa House, Dange Chowk Rd, Thergaon, Pimpri-Chinchwad, Maharashtra. Check the footer for the full address and Google Maps link.";
      } else if (lowerText.includes("founder") || lowerText.includes("ceo") || lowerText.includes("team")) {
        response = "Codelyne Technologies was founded by experienced professionals in AI and enterprise software. Visit our About page to learn more about our leadership team.";
      } else if (lowerText.includes("personal") || lowerText.includes("private") || lowerText.includes("family") || lowerText.includes("married") || lowerText.includes("age") || lowerText.includes("salary")) {
        response = "I can only provide information about Codelyne Technologies, our products, and services. For other inquiries, please contact our team directly.";
      } else if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("pricing")) {
        response = "For pricing information, please contact our sales team or request a demo. We offer customized solutions based on your requirements.";
      }
      
      setMessages(prev => [...prev, { role: "bot", content: response }]);
    }, 1000);
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
                placeholder="Type a message..."
                className="bg-white/5 border-white/10 text-white pr-10 focus:border-primary/50 rounded-xl"
              />
              <button 
                onClick={() => handleSend()}
                className="absolute right-2 top-2 text-primary hover:text-white transition-colors"
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
