"use client";

import { useAppSelector } from "@/lib/hooks";
import { DashboardHeader } from "./dashboard-header";
import { MentorDashboard } from "./role-dashboards/mentor-dashboard";
import MenteeDashboard from "./role-dashboards/mentee-dashboard";
import { AdminDashboard } from "./role-dashboards/admin-dashboard";
import { LecturerDashboard } from "./role-dashboards/lecturer-dashboard";
import { CompanyDashboard } from "./role-dashboards/company-dashboard";

export function RoleBasedDashboard() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  const renderRoleSpecificDashboard = () => {
    switch (user.role?.toLowerCase()) {
      case "admin":
        return <AdminDashboard />;
      case "mentor":
        return <MentorDashboard />;
      case "lecturer":
      case "expert":
        return <LecturerDashboard />;
      case "company":
        return <CompanyDashboard />;
      case "mentee":
      default:
        // Default mentee dashboard
        return <MenteeDashboard />;
    }
  };

  return (
    <>
      <DashboardHeader />
      {renderRoleSpecificDashboard()}
    </>
  );
}
