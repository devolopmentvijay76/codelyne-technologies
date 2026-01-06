import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { JarvisLogo } from "@/components/ui/JarvisLogo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isLoggingIn, loginError, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/admin");
    }
  }, [isAuthenticated, setLocation]);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password }, {
      onSuccess: () => {
        setLocation("/admin");
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-lg relative z-10" data-testid="card-login">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <JarvisLogo size="md" heartbeat />
          </div>
          <CardTitle className="text-2xl font-heading text-white">Admin Login</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to access the admin panel
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {loginError && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-400" data-testid="alert-error">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError.message}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                required
                data-testid="input-username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                required
                data-testid="input-password"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-primary text-background font-bold hover:bg-primary/90"
              disabled={isLoggingIn}
              data-testid="button-login"
            >
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Codelyne Technologies Admin Portal
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
