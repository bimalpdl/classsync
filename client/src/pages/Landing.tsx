import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap } from "lucide-react";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      alert('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplitLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-class-sync-background">
      <Card className="w-full max-w-md bg-class-sync-surface rounded-2xl shadow-lg">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 class-sync-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="text-white text-2xl" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-class-sync-primary mb-2">Class Sync</h1>
            <p className="text-class-sync-secondary">Assignment Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-class-sync-primary mb-2">
                Email Address
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-class-sync-primary mb-2">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-class-sync-secondary">
                  Remember me
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full class-sync-primary font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleReplitLogin}
              variant="outline"
              className="w-full border-gray-300 text-class-sync-primary hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Sign in with Replit
            </Button>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-class-sync-primary mb-2">Demo Accounts:</h4>
              <div className="text-sm space-y-1 text-class-sync-secondary">
                <p><strong>Teacher:</strong> teacher@patancampus.edu.np / password123</p>
                <p><strong>Student 1:</strong> niroj.thapa@student.patancampus.edu.np / password123</p>
                <p><strong>Student 2:</strong> bimal.paudel@student.patancampus.edu.np / password123</p>
                <p><strong>Student 3:</strong> priya.adhikari@student.patancampus.edu.np / password123</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
