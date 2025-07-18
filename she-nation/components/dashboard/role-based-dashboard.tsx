"use client"

import { useAppSelector } from "@/lib/hooks"
import { DashboardHeader } from "./dashboard-header"
import { MentorDashboard } from "./role-dashboards/mentor-dashboard"
import { LecturerDashboard } from "./role-dashboards/lecturer-dashboard"
import { CompanyDashboard } from "./role-dashboards/company-dashboard"
import { StatsCards } from "./stats-cards"
// import { RecentActivity } from "./recent-activity"
import { UpcomingSessions } from "./upcoming-sessions"
import { CourseProgress } from "./course-progress"
import { QuickActions } from "./quick-actions"

export function RoleBasedDashboard() {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) return null

  const renderRoleSpecificDashboard = () => {
    switch (user.role) {
      case "mentor":
        return <MentorDashboard />
      case "lecturer":
        return <LecturerDashboard />
      case "company":
        return <CompanyDashboard />
      default:
        // Default mentee dashboard
        return (
          <>
            <StatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2 space-y-6">
                {/* <RecentActivity /> */}
                <CourseProgress />
              </div>
              <div className="space-y-6">
                <UpcomingSessions />
                <QuickActions />
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <>
      <DashboardHeader />
      {renderRoleSpecificDashboard()}
    </>
  )
}
