import type { Metadata } from "next"
import { JobApplicants } from "@/components/jobs/job-applicants"
import { AuthGuard } from "@/components/auth/auth-guard"

export const metadata: Metadata = {
  title: "Job Applicants - SheNation",
  description: "View applications for your posted job opportunities",
}

export default function JobApplicantsPage() {
  return (
    <AuthGuard allowedRoles={["admin", "mentor", "company", "lecturer"]}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Applicants</h1>
            <p className="text-gray-600">View and manage applications for your posted job opportunities</p>
          </div>

          <JobApplicants />
        </div>
      </div>
    </AuthGuard>
  )
}
