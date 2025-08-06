"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import {
  Users,
  Star,
  DollarSign,
  Award,
  Plus,
  Edit,
  BarChart3,
  Calendar,
  Video,
  BookOpen,
  Clock,
  TrendingUp,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CourseManagement } from "@/components/courses/course-management";

export function MentorDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(
    undefined
  );
  const router = useRouter();

  const handleCreateCourse = () => {
    setSelectedCourseId(undefined);
    setShowCourseModal(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Courses */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold font-poppins text-gray-900">
                  My Courses
                </h3>
                <button
                  onClick={handleCreateCourse}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New
                </button>
              </div>
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>You haven't created any courses yet</p>
              </div>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-xl font-semibold font-poppins text-gray-900 mb-6">
              Performance Analytics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">Session Growth</h4>
                <p className="text-2xl font-bold text-green-600">+23%</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Sessions",
      value: "0",
      change: "+0 this month",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Mentees",
      value: "0",
      change: "+0 new this month",
      icon: Star,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Average Rating",
      value: "N/A",
      change: "No feedback yet",
      icon: Award,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Total Earnings",
      value: "$0",
      change: "+0% this month",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "sessions", label: "Sessions" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
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
            {tabs.map((tab) => (
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

      {/* Course Management Modal */}
      {showCourseModal && (
        <CourseManagement
          courseId={selectedCourseId}
          onClose={() => setShowCourseModal(false)}
        />
      )}
    </div>
  );
}
