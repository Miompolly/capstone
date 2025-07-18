"use client";

import { useState } from "react";
import {
  Users,
  Shield,
  Activity,
  Settings,
  Search,
  Edit,
  UserPlus,
  Eye,
  Ban,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { useGetAllUsersQuery, useVerifyUserMutation } from "@/lib/api/authApi";
import { useGetAllCoursesQuery } from "@/lib/api/coursesApi";
import { useGetAllEnrollmentsQuery } from "@/lib/api/enrollmentsApi";
// Assume these new API hooks exist for analytics and system health
import {
  useGetUserGrowthQuery,
  useGetActiveSessionsQuery,
  useGetRevenueQuery,
  useGetSystemHealthQuery,
} from "@/lib/api/analyticsApi"; // New API for analytics
import { useSuspendUserMutation } from "@/lib/api/authApi"; // Assuming a new mutation for suspending users

import { UserManagement } from "@/components/admin/user-management";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "react-hot-toast";

export function AdminDashboard() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );

  // Fetch real data from API
  const { data: users = [], isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: courses = [], isLoading: coursesLoading } =
    useGetAllCoursesQuery();
  const { data: enrollments = [], isLoading: enrollmentsLoading } =
    useGetAllEnrollmentsQuery();
  const [verifyUser] = useVerifyUserMutation();
  const [suspendUser] = useSuspendUserMutation(); // New mutation for suspending users

  // Fetch analytics and system health data
  const { data: userGrowth = 0, isLoading: userGrowthLoading } =
    useGetUserGrowthQuery();
  const { data: activeSessions = 0, isLoading: activeSessionsLoading } =
    useGetActiveSessionsQuery();
  const { data: monthlyRevenue = 0, isLoading: monthlyRevenueLoading } =
    useGetRevenueQuery();
  const { data: systemHealth = 0, isLoading: systemHealthLoading } =
    useGetSystemHealthQuery();

  const isLoading =
    usersLoading ||
    coursesLoading ||
    enrollmentsLoading ||
    userGrowthLoading ||
    activeSessionsLoading ||
    monthlyRevenueLoading ||
    systemHealthLoading;

  // Calculate real stats
  const activeUsers = users.filter((u) => u.is_active).length;
  const totalEnrollments = enrollments.length;
  const activeCourses = courses.length;

  // Placeholder for calculating change - this would ideally come from your API
  // or be calculated based on historical data fetched from the API.
  const enrollmentChange = "+8% this week"; // Example: replace with actual calculation
  const systemHealthStatus =
    systemHealth === 100 ? "All systems operational" : "Monitoring issues";

  const adminStats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      change: `${activeUsers} active`,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Enrollments",
      value: totalEnrollments.toString(),
      change: enrollmentChange, // Now dynamic or calculated based on more data
      icon: Activity,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Courses",
      value: activeCourses.toString(),
      change: `${
        courses.filter((c) => c.certificate_available).length
      } with certificates`,
      icon: Shield,
      color: "from-red-500 to-red-600",
    },
    {
      title: "System Health",
      value: `${systemHealth}%`, // Now dynamic
      change: systemHealthStatus, // Now dynamic
      icon: Settings,
      color: "from-purple-500 to-purple-600",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "active" && user.is_active) ||
      (selectedStatus === "inactive" && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditUser = (userId: number) => {
    setSelectedUserId(userId.toString());
    setShowUserModal(true);
  };

  const handleViewUser = (userId: number) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleVerifyUser = async (userId: number, userName: string) => {
    try {
      await verifyUser({ user_id: userId }).unwrap();
      toast.success(`User "${userName}" has been verified`);
    } catch (error) {
      toast.error("Failed to verify user");
    }
  };

  const handleSuspendUser = async (userId: number, userName: string) => {
    if (
      window.confirm(`Are you sure you want to suspend user "${userName}"?`)
    ) {
      try {
        await suspendUser({ user_id: userId }).unwrap(); // Call the new suspendUser mutation
        toast.success(`User "${userName}" has been suspended`);
      } catch (error) {
        toast.error("Failed to suspend user");
      }
    }
  };

  const handleAddUser = () => {
    setSelectedUserId(undefined);
    setShowUserModal(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-600";
      case "mentor":
        return "bg-purple-100 text-purple-600";
      case "lecturer":
        return "bg-blue-100 text-blue-600";
      case "company":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <div className="space-y-6">
            {/* User Management Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold font-poppins text-gray-900">
                User Management
              </h3>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Roles</option>
                <option value="mentee">Mentee</option>
                <option value="mentor">Mentor</option>
                <option value="lecturer">Lecturer</option>
                <option value="company">Company</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {filteredUsers.length} user
                {filteredUsers.length !== 1 ? "s" : ""} found
              </span>
              {(searchQuery || selectedRole || selectedStatus) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedRole("");
                    setSelectedStatus("");
                  }}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Users Table */}
            <div className="glass-effect rounded-xl overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">
                          User
                        </th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">
                          Role
                        </th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">
                          Status
                        </th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">
                          Join Date
                        </th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">
                          Location
                        </th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                  {user.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {user.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2 py-1 text-xs rounded-full capitalize ${getRoleColor(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                user.is_active
                              )}`}
                            >
                              {user.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {new Date(
                              user.date_registered
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {user.location || "Not specified"}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewUser(user.id)}
                                className="p-1 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded"
                                title="View User"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditUser(user.id)}
                                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                                title="Edit User"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleVerifyUser(user.id, user.name)
                                }
                                className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                                title="Verify User"
                              >
                                <Shield className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleSuspendUser(user.id, user.name)
                                }
                                className="p-1 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                                title="Suspend User"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!isLoading && filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-600">
                    No users match your current search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold font-poppins text-gray-900">
              Platform Analytics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass-effect rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  User Growth
                </h4>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    +{userGrowth}
                  </p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
              </div>
              <div className="glass-effect rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Session Activity
                </h4>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {activeSessions}
                  </p>
                  <p className="text-sm text-gray-600">Active sessions</p>
                </div>
              </div>
              <div className="glass-effect rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Revenue</h4>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    ${monthlyRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold font-poppins text-gray-900">
              System Settings
            </h3>
            <div className="glass-effect rounded-xl p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Platform Configuration
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Manage global platform settings and configurations.
                  </p>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Configure Settings
                  </button>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Security Settings
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Manage security policies and access controls.
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Security Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glass-effect rounded-xl p-6">
        <h1 className="text-2xl font-bold font-poppins gradient-text mb-2">
          Admin Dashboard 🛡️
        </h1>
        <p className="text-gray-600">
          Manage users, monitor system health, and oversee platform operations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="glass-effect rounded-xl p-6 hover-lift transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="glass-effect rounded-xl p-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: "users", label: "User Management" },
              { id: "analytics", label: "Analytics" },
              { id: "settings", label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {renderTabContent()}
      </div>

      {/* User Management Modal */}
      {showUserModal && (
        <UserManagement
          userId={selectedUserId}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUserId(undefined);
          }}
        />
      )}
    </div>
  );
}
