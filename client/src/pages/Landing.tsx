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
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState(false);

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

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError("");
    setSignUpSuccess(false);
    if (signUpData.password !== signUpData.confirmPassword) {
      setSignUpError("Passwords do not match");
      return;
    }
    setSignUpLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: signUpData.firstName,
          lastName: signUpData.lastName,
          email: signUpData.email,
          password: signUpData.password,
          role: signUpData.role,
        }),
      });
      if (response.ok) {
        setSignUpSuccess(true);
        setSignUpData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "student",
        });
      } else {
        const data = await response.json();
        setSignUpError(data.message || "Registration failed");
      }
    } catch (error) {
      setSignUpError("Registration failed");
    } finally {
      setSignUpLoading(false);
    }
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

          {!showSignUp ? (
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
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 underline"
                  onClick={() => setShowSignUp(true)}
                >
                  New here? Create an account
                </Button>
              </div>

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
          ) : (
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <Label htmlFor="firstName" className="block text-sm font-medium text-class-sync-primary mb-2">
                    First Name
                  </Label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={signUpData.firstName}
                    onChange={handleSignUpChange}
                    placeholder="First name"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="lastName" className="block text-sm font-medium text-class-sync-primary mb-2">
                    Last Name
                  </Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={signUpData.lastName}
                    onChange={handleSignUpChange}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="signUpEmail" className="block text-sm font-medium text-class-sync-primary mb-2">
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="signUpEmail"
                  name="email"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <Label htmlFor="signUpPassword" className="block text-sm font-medium text-class-sync-primary mb-2">
                    Password
                  </Label>
                  <Input
                    type="password"
                    id="signUpPassword"
                    name="password"
                    value={signUpData.password}
                    onChange={handleSignUpChange}
                    placeholder="Password (min 6 chars)"
                    minLength={6}
                    required
                  />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="confirmPassword" className="block text-sm font-medium text-class-sync-primary mb-2">
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={signUpData.confirmPassword}
                    onChange={handleSignUpChange}
                    placeholder="Confirm password"
                    minLength={6}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="role" className="block text-sm font-medium text-class-sync-primary mb-2">
                  Role
                </Label>
                <select
                  id="role"
                  name="role"
                  value={signUpData.role}
                  onChange={handleSignUpChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              {signUpError && <div className="text-red-600 text-sm">{signUpError}</div>}
              {signUpSuccess && <div className="text-green-600 text-sm">Account created! You can now sign in.</div>}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/2"
                  onClick={() => setShowSignUp(false)}
                  disabled={signUpLoading}
                >
                  Back to Sign In
                </Button>
                <Button
                  type="submit"
                  className="w-1/2 class-sync-primary font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  disabled={signUpLoading}
                >
                  {signUpLoading ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
