import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

import logo from "../assets/logo.png";
import vaiLogo from "../assets/vailogo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      window.location.href = "/";
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="grid md:grid-cols-2 min-h-[600px]">

            {/* Left Side - Branding */}
            <div className="bg-gradient-to-br from-[#181c4c] via-[#238fb7] to-[#1e40af] p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
              {/* Decorative circles */}


              <div className="text-center space-y-8 relative z-10">
                {/* Logos Section */}
                <div className="space-y-6">
                  {/* AZAM TV Logo */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                        <img
                          src={logo}
                          alt="AZAM TV Logo"
                          className="w-32 h-auto object-contain"
                        />
                      </div>

                    </div>
                  </div>

                  {/* VAI Logo */}
                  <div className="flex justify-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <img
                        src={vaiLogo}
                        alt="VAI Logo"
                        className="w-40 h-auto object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Welcome Back
                  </h1>
                  <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                    Access your AZAM TV agent management portal and streamline your operations with our intelligent platform.
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-2 text-sm text-blue-200">
                  <div className="w-2 h-2 bg-[#e67c1a] rounded-full animate-pulse"></div>
                  <span>Secure • Reliable • Professional</span>
                  <div className="w-2 h-2 bg-[#e67c1a] rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="p-12 flex flex-col justify-center">
              <div className="w-full max-w-sm mx-auto space-y-8">

                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                  <p className="text-gray-600">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#238fb7] focus:ring-[#238fb7] transition-all duration-200"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="w-2 h-2 bg-[#e67c1a] rounded-full opacity-60"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#238fb7] focus:ring-[#238fb7] transition-all duration-200"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="w-2 h-2 bg-[#e67c1a] rounded-full opacity-60"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        className="data-[state=checked]:bg-[#238fb7] data-[state=checked]:border-[#238fb7]"
                      />
                      <Label 
                        htmlFor="remember-me" 
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-[#238fb7] hover:text-[#181c4c] font-medium p-0 h-auto"
                      onClick={() => setLocation("/forgot-password")}
                    >
                      Forgot your password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-[#238fb7] to-[#181c4c] hover:from-[#181c4c] hover:to-[#238fb7] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign In to Dashboard"
                    )}
                  </Button>
                </form>

                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Need assistance?{" "}
                    <a 
                      href="mailto:admin@azamtv.com" 
                      className="text-[#238fb7] hover:text-[#181c4c] font-medium hover:underline transition-colors"
                    >
                      Contact Support
                    </a>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
