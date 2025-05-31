import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Redirect } from "wouter";
import { Loader2, ShoppingCart, User, Lock } from "lucide-react";

export default function AuthPage() {
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (user) {
    return <Redirect to="/products" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      registerMutation.mutate({
        username: formData.username,
        password: formData.password,
      });
    } else {
      loginMutation.mutate({
        username: formData.username,
        password: formData.password,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isFormLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              {mode === "login" ? (
                <Lock className="h-6 w-6 text-white" />
              ) : (
                <User className="h-6 w-6 text-white" />
              )}
            </div>
            <CardTitle className="text-2xl font-medium text-slate-800">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <p className="text-slate-600 mt-2">
              {mode === "login" 
                ? "Sign in to your account" 
                : "Join us and start shopping"
              }
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your username"
                  disabled={isFormLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your password"
                  disabled={isFormLoading}
                />
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Confirm your password"
                    disabled={isFormLoading}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isFormLoading}
              >
                {isFormLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-slate-600">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-blue-600 hover:text-blue-700 font-medium"
                disabled={isFormLoading}
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-semibold mb-4">
            E-Commerce Platform
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Manage your products efficiently with our modern and intuitive platform. 
            Create, update, and organize your inventory with ease.
          </p>
        </div>
      </div>
    </div>
  );
}
