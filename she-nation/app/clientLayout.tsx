"use client";

import type React from "react";
import { useEffect } from "react";
import { Navigation } from "@/components/layout/navigation";
import { RoleBasedRedirect } from "@/components/auth/role-redirect";
import { useAppDispatch } from "@/lib/hooks";
import { initializeAuth } from "@/lib/slices/authSlice";
import { useRealtimeNotifications } from "@/components/notifications/notification-bell";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  // Enable real-time notifications
  useRealtimeNotifications();

  useEffect(() => {
    // Initialize auth state from cookies
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <div className="font-arial">
      <Navigation />
      <RoleBasedRedirect />
      <main className="mt-20">{children}</main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            fontFamily: "Arial, sans-serif",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10B981",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#EF4444",
            },
          },
        }}
      />
    </div>
  );
}
