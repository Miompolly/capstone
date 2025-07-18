"use client"

import { useState } from "react"
import { BookOpen, Users, Star, TrendingUp, MessageCircle, Award, BarChart } from "lucide-react"
import { useAppSelector } from "@/lib/hooks"

export function LecturerDashboard() {
  const { user } = useAppSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("overview")

  const lecturerStats = [
    {
      title: "Active Courses",
      value: user?.coursesCreated?.toString() || "8",
      change: "+2 this month",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Students",
      value: user?.totalStudents?.toLocaleString() || "1,247",
      change: "+89 this week",
      icon: Users,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Average Rating",
      value: user?.rating?.toString() || "4.8",
      change: "+0.2 this month",
      icon: Star,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Course Completion",
      value: `${user?.courseCompletionRate || 87}%`,
      change: "+5% this month",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
    },
  ]

  const courses = [
    {
      id: "1",
      title: "Data Science Fundamentals",
      students: 342,
      completion: 78,
      rating: 4.9,
      revenue: "$3,420",
      status: "Active",
    },
    {
      id: "2",
      title: "Advanced Python Programming",
      students: 256,
      completion: 85,
      rating: 4.7,
      revenue: "$2,560",
      status: "Active",
    },
    {
      id: "3",
      title: "Machine Learning Basics",
      students: 189,
      completion: 92,
      rating: 4.8,
      revenue: "$1,890",
      status: "Active",
    },
  ]

  const recentActivity = [
    {
      id: "1",
      action: "New student enrolled",
      course: "Data Science Fundamentals",
      time: "5 min ago",
      type: "enrollment",
    },
    {
      id: "2",
      action: "Assignment submitted",
      course: "Advanced Python",
      time: "1h ago",
      type: "assignment",
    },
    {
      id: "3",
      action: "Question posted in forum",
      course: "ML Basics",
      time: "2h ago",
      type: "question",
    },
    {
      id: "4",
      action: "Course completed",
      course: "Data Science Fundamentals",
      time: "3h ago",
      type: "completion",
    },
  ]

  const studentProgress = [
    { name: "Sarah Johnson", course: "Data Science", progress: 85, lastActive: "2h ago" },
    { name: "Maria Garcia", course: "Python Programming", progress: 92, lastActive: "1d ago" },
    { name: "Aisha Patel", course: "Machine Learning", progress: 67, lastActive: "3h ago" },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Performance */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-xl font-semibold font-poppins text-gray-900 mb-6">Course Performance</h3>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-green-600">{course.revenue}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{course.students} students</span>
                      <span>{course.completion}% completion</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                        style={{ width: `${course.completion}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-xl font-semibold font-poppins text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === "enrollment"
                          ? "bg-blue-100"
                          : activity.type === "assignment"
                            ? "bg-green-100"
                            : activity.type === "question"
                              ? "bg-yellow-100"
                              : "bg-purple-100"
                      }`}
                    >
                      {activity.type === "enrollment" && <Users className="w-4 h-4 text-blue-600" />}
                      {activity.type === "assignment" && <BookOpen className="w-4 h-4 text-green-600" />}
                      {activity.type === "question" && <MessageCircle className="w-4 h-4 text-yellow-600" />}
                      {activity.type === "completion" && <Award className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.course}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "courses":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold font-poppins text-gray-900">My Courses</h3>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Create New Course
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="glass-effect rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        course.status === "Active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {course.status}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Students:</span>
                      <span className="font-medium">{course.students}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completion:</span>
                      <span className="font-medium">{course.completion}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium text-green-600">{course.revenue}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                      Edit Course
                    </button>
                    <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      View Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "students":
        return (
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-xl font-semibold font-poppins text-gray-900 mb-6">Student Progress</h3>
            <div className="space-y-4">
              {studentProgress.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`/placeholder.svg?height=40&width=40`}
                      alt={student.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.course}</p>
                      <p className="text-xs text-gray-500">Last active: {student.lastActive}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 mb-1">{student.progress}%</div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "analytics":
        return (
          <div className="space-y-6">
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-xl font-semibold font-poppins text-gray-900 mb-6">Teaching Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <BarChart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Engagement Rate</h4>
                  <p className="text-2xl font-bold text-blue-600">89%</p>
                  <p className="text-sm text-gray-600">avg across courses</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Revenue Growth</h4>
                  <p className="text-2xl font-bold text-green-600">+34%</p>
                  <p className="text-sm text-gray-600">vs last quarter</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Student Satisfaction</h4>
                  <p className="text-2xl font-bold text-purple-600">4.8/5</p>
                  <p className="text-sm text-gray-600">average rating</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glass-effect rounded-xl p-6">
        <h1 className="text-2xl font-bold font-poppins gradient-text mb-2">
          Welcome back, {user?.name?.split(" ")[0]}! 📚
        </h1>
        <p className="text-gray-600">Ready to inspire and educate your students today?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {lecturerStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="glass-effect rounded-xl p-6 hover-lift transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="glass-effect rounded-xl p-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "courses", label: "My Courses" },
              { id: "students", label: "Students" },
              { id: "analytics", label: "Analytics" },
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
    </div>
  )
}
