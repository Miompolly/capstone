import { AuthGuard } from "@/components/auth/auth-guard"
import { ForumHeader } from "@/components/forum/forum-header"
import { ForumSidebar } from "@/components/forum/forum-sidebar"
import { ForumPosts } from "@/components/forum/forum-posts"

export default function ForumPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <ForumHeader />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ForumSidebar />
            </div>
            <div className="lg:col-span-3">
              <ForumPosts />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
