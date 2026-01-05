import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, FileText, Image as ImageIcon, Settings, LogOut, ChevronRight } from "lucide-react";
import { JarvisLogo } from "@/components/ui/JarvisLogo";

export default function Admin() {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-white/5 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <JarvisLogo size="sm" heartbeat />
          <span className="font-heading font-bold text-white text-lg">Admin Panel</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: FileText, label: "Pages & Content" },
            { icon: ImageIcon, label: "Media Library" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button 
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                item.active 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <Link href="/">
          <Button 
            variant="ghost" 
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 justify-start w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Back to Site
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">admin@codelyne.tech</span>
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">
              A
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <Card className="bg-white/5 border-white/10">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-gray-400">Total Enquiries</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-3xl font-bold text-white">24</div>
               <p className="text-xs text-green-400 mt-1">+12% from last week</p>
             </CardContent>
           </Card>
           <Card className="bg-white/5 border-white/10">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-gray-400">Site Visits</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-3xl font-bold text-white">1,204</div>
               <p className="text-xs text-green-400 mt-1">+5% from yesterday</p>
             </CardContent>
           </Card>
           <Card className="bg-white/5 border-white/10">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-gray-400">System Status</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-xl font-bold text-primary flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 Operational
               </div>
             </CardContent>
           </Card>
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      JD
                    </div>
                    <div>
                      <h4 className="text-white font-medium">John Doe</h4>
                      <p className="text-xs text-gray-400">Interest in CogniFlow ERP</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary">
                    View <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
