"use client";

import {
  Clock,
  BookOpen,
  Users,
  MessageCircle,
  Briefcase,
  BarChart2,
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks";

// Define activity types for different roles
const roleBasedActivities = {
  admin: [
    {
      id: "1",
      type: "users",
      title: "Approved new mentor registration",
      time: "1 hour ago",
      icon: Users,
      color: "text-blue-600",
    },
    {
      id: "2",
      type: "system",
      title: "Performed system maintenance",
      time: "3 hours ago",
      icon: BarChart2,
      color: "text-red-600",
    },
    {
      id: "3",
      type: "content",
      title: "Published new course module",
      time: "1 day ago",
      icon: BookOpen,
      color: "text-purple-600",
    },
  ],
  mentor: [
    {
      id: "1",
      type: "mentorship",
      title: "Completed session with mentee Sarah",
      time: "2 hours ago",
      icon: Users,
      color: "text-pink-600",
    },
    {
      id: "2",
      type: "course",
      title: "Updated course materials",
      time: "1 day ago",
      icon: BookOpen,
      color: "text-indigo-600",
    },
    {
      id: "3",
      type: "forum",
      title: "Answered question in Career Development forum",
      time: "2 days ago",
      icon: MessageCircle,
      color: "text-teal-600",
    },
  ],
  mentee: [
    {
      id: "1",
      type: "course",
      title: 'Completed "Advanced Leadership Strategies" module',
      time: "2 hours ago",
      icon: BookOpen,
      color: "text-purple-600",
    },
    {
      id: "2",
      type: "mentorship",
      title: "Mentorship session with Dr. Emily Chen",
      time: "1 day ago",
      icon: Users,
      color: "text-pink-600",
    },
    {
      id: "3",
      type: "forum",
      title: 'Posted in "Career Development" forum',
      time: "2 days ago",
      icon: MessageCircle,
      color: "text-indigo-600",
    },
  ],
  lecturer: [
    {
      id: "1",
      type: "course",
      title: "Graded assignments for CS101",
      time: "3 hours ago",
      icon: BookOpen,
      color: "text-purple-600",
    },
    {
      id: "2",
      type: "lecture",
      title: "Uploaded new lecture materials",
      time: "1 day ago",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      id: "3",
      type: "forum",
      title: "Answered student questions",
      time: "2 days ago",
      icon: MessageCircle,
      color: "text-green-600",
    },
  ],
  company: [
    {
      id: "1",
      type: "job",
      title: "Posted new Software Engineer position",
      time: "5 hours ago",
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      id: "2",
      type: "application",
      title: "Reviewed 15 new applications",
      time: "1 day ago",
      icon: Users,
      color: "text-purple-600",
    },
    {
      id: "3",
      type: "analytics",
      title: "Checked recruitment metrics",
      time: "2 days ago",
      icon: BarChart2,
      color: "text-indigo-600",
    },
  ],
  default: [
    {
      id: "1",
      type: "welcome",
      title: "Welcome to SheNation!",
      time: "Just now",
      icon: Users,
      color: "text-pink-600",
    },
    {
      id: "2",
      type: "explore",
      title: "Explore available courses",
      time: "1 day ago",
      icon: BookOpen,
      color: "text-purple-600",
    },
    {
      id: "3",
      type: "community",
      title: "Join our community forums",
      time: "2 days ago",
      icon: MessageCircle,
      color: "text-teal-600",
    },
  ],
};

export function RecentActivity() {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || "default";
  const activities =
    roleBasedActivities[role as keyof typeof roleBasedActivities] ||
    roleBasedActivities.default;

  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-xl font-semibold font-poppins text-gray-900 mb-6">
        {role === "default" ? "Getting Started" : "Recent Activity"}
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/50 transition-colors"
            >
              <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
