import { AuthGuard } from "@/components/auth/auth-guard"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <ProfileHeader />
          <ProfileTabs />
        </div>
      </div>
    </AuthGuard>
  )
}
