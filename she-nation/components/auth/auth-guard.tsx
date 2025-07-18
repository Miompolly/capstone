"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/lib/hooks"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { canAccessResource } from "@/lib/auth/auth-service"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: string[]
  resource?: string
}

export function AuthGuard({ children, requireAuth = true, allowedRoles, resource }: AuthGuardProps) {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Check if authentication is required
      if (requireAuth && !isAuthenticated) {
        router.push("/auth/login")
        return
      }

      // Check role-based access
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.push("/unauthorized")
        return
      }

      // Check resource-based access
      if (resource && user && !canAccessResource(user.role, resource)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [isAuthenticated, user, isLoading, requireAuth, allowedRoles, resource, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null
  }

  if (resource && user && !canAccessResource(user.role, resource)) {
    return null
  }

  return <>{children}</>
}
