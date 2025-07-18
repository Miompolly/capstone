"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { CreateJobForm } from "@/components/jobs/create-job-form"
import { useAppSelector } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CreateJobPage() {
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (user?.role === "mentee") {
      router.push("/jobs")
    }
  }, [user?.role, router])

  if (user?.role === "mentee") {
    return null
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
              <p className="text-gray-600">Create a new job opportunity for the SheNation community</p>
            </div>
            <CreateJobForm />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
