import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lock, LayoutDashboard, FileText, Image as ImageIcon, Settings, LogOut, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@codelyne.tech",
      password: "",
    },
  });

  function onLogin(values: z.infer<typeof loginSchema>) {
    if (values.email === "admin@codelyne.tech" && values.password === "Admin@123") {
      setIsLoggedIn(true);
      toast({
        title: "Welcome Back",
        description: "Successfully logged into Admin Dashboard",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-white/5 p-6 hidden md:flex flex-col">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
              <div className="w-4 h-4 bg-primary rounded-full" />
            </div>
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

          <Button 
            variant="ghost" 
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 justify-start"
            onClick={() => setIsLoggedIn(false)}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
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

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10 px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/50 mb-6">
             <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400">Secure access for authorized personnel only.</p>
        </div>

        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onLogin)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white/5 border-white/10 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="bg-white/5 border-white/10 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center text-sm">
                   <Link href="/" className="text-gray-500 hover:text-white transition-colors">← Back to Site</Link>
                   <a href="#" className="text-primary hover:underline">Forgot Password?</a>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-background font-bold">
                  Access Dashboard
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="bg-white/5 border-t border-white/5 py-4 justify-center">
             <p className="text-xs text-gray-500 text-center">
               Restricted Area. All activities are monitored.<br/>
               Use <span className="text-gray-300 font-mono">admin@codelyne.tech</span> / <span className="text-gray-300 font-mono">Admin@123</span>
             </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
