"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

export function RoleBasedRedirect() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      const roleRoutes = {
        admin: "/dashboard",
        mentor: "/dashboard",
        lecturer: "/dashboard",
        company: "/dashboard",
        mentee: "/dashboard",
      };

      const targetRoute =
        roleRoutes[user.role as keyof typeof roleRoutes] || "/dashboard";

      // Only redirect if we're on the home page or auth pages
      const currentPath = window.location.pathname;
      if (currentPath === "/" || currentPath.startsWith("/auth/")) {
        router.push(targetRoute);
      }
    }
  }, [isAuthenticated, user, router]);

  return null;
}
