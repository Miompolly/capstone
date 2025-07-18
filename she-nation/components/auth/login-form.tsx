"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/lib/api/authApi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { loginSuccess, loginFailure, loginStart } from "@/lib/slices/authSlice";
import toast from "react-hot-toast";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Role-based redirect mapping
  const getRoleBasedRoute = (role: string) => {
    const roleRoutes = {
      admin: "/dashboard",
      mentor: "/dashboard",
      lecturer: "/dashboard",
      company: "/dashboard",
      mentee: "/dashboard",
    };
    return roleRoutes[role as keyof typeof roleRoutes] || "/dashboard";
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const targetRoute = getRoleBasedRoute(user.role);
      router.push(targetRoute);
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      dispatch(loginStart());
      const result = await login({ email, password }).unwrap();

      dispatch(
        loginSuccess({
          user: result.user,
          access: result.access,
          refresh: result.refresh,
        })
      );

      toast.success("Login successful!");

      // Role-based redirect
      const targetRoute = getRoleBasedRoute(result.user.role);
      router.push(targetRoute);
    } catch (error: any) {
      const errorMessage =
        error?.data?.detail || error?.data?.message || "Login failed";
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  // Don't render form if already authenticated (prevents flash)
  if (isAuthenticated && user) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-sm text-purple-600 hover:text-purple-700">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
