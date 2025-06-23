import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap } from "lucide-react";

export default function Landing() {
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
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

          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-class-sync-primary mb-2">
                Email Address
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-class-sync-primary mb-2">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
              <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Forgot password?
              </button>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full class-sync-primary font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Sign In
            </Button>

            <div className="text-center">
              <p className="text-class-sync-secondary">
                Don't have an account?{" "}
                <button
                  onClick={handleLogin}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
