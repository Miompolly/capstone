"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  Search,
  LogOut,
  Shield,
  BarChart3,
  Building2,
  Calendar,
  HelpCircle,
  Home,
  BookOpen,
  User2,
  Users,
  UserCheck,
  Settings,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/slices/authSlice";
import { NotificationBell } from "@/components/notifications/notification-bell";

// Navigation items with role-based access
const getNavigationItems = (
  role: string | undefined,
  isAuthenticated: boolean
) => {
  const baseItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      roles: ["admin", "Mentor", "mentee", "Expert", "company", "guest"],
    },
  ];

  const authenticatedItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["admin", "Mentor", "mentee", "Expert", "company"],
    },
    {
      name: "Courses",
      href: "/courses",
      icon: BookOpen,
      roles: ["admin", "Mentor", "mentee", "Expert"],
    },
    {
      name: "Mentorship",
      href: "/mentorship",
      icon: User2,
      roles: ["mentee"],
    },
    {
      name: "Bookings",
      href: "/bookings",
      icon: Calendar,
      roles: ["mentee"],
    },
    {
      name: "My Calendar",
      href: "/calendar",
      icon: Calendar,
      roles: ["Mentor", "mentee", "admin"],
    },
    {
      name: "Jobs",
      href: "/jobs",
      icon: Building2,
      roles: ["admin", "mentee", "company"],
    },
    {
      name: "Booking Requests",
      href: "/mentor-bookings",
      icon: UserCheck,
      roles: ["Mentor"],
    },
    {
      name: "Analytics",
      href: "/mentor-analytics",
      icon: BarChart3,
      roles: ["Mentor", "admin"],
    },
    {
      name: "Users",
      href: "/users",
      icon: Users,
      roles: ["admin"],
    },
  ];

  if (!isAuthenticated) {
    return baseItems;
  }

  const userRole = role || "mentee";
  const allItems = [...baseItems, ...authenticatedItems];

  return allItems.filter((item) => item.roles.includes(userRole));
};

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
    setShowProfileMenu(false);
  };

  const navigationItems = getNavigationItems(user?.role, isAuthenticated);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-600";
      case "mentor":
        return "bg-purple-100 text-purple-600";
      case "Expert":
        return "bg-blue-100 text-blue-600";
      case "company":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SN</span>
            </div>
            <span className="font-poppins font-bold text-xl gradient-text">
              SheNation
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? "text-purple-600"
                      : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Search */}
                <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <NotificationBell />

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <User2 className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="font-medium text-gray-700">
                        {user?.name}
                      </div>
                      <div
                        className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(
                          user?.role || "mentee"
                        )}`}
                      >
                        {user?.role}
                      </div>
                    </div>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <p className="font-medium text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <div className="flex items-center mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getRoleColor(
                              user?.role || "mentee"
                            )}`}
                          >
                            {user?.role}
                          </span>
                          {user?.role === "admin" && (
                            <Shield className="w-3 h-3 ml-2 text-red-600" />
                          )}
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Profile Settings
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/30">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-purple-100 text-purple-600"
                        : "text-gray-700 hover:bg-white/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/30">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
