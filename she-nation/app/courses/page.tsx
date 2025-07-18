import { AuthGuard } from "@/components/auth/auth-guard"
import { CoursesPageContent } from "@/components/courses/courses-page-content"

export default function CoursesPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <CoursesPageContent />
        </div>
      </div>
    </AuthGuard>
  )
}
