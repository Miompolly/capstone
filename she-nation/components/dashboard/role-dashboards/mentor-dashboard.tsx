"use client"

import { useState } from "react"
import { Users, Star, DollarSign, Clock, TrendingUp, Award, Plus, Edit, BarChart3, Calendar, Video } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { addNotification } from "@/lib/slices/notificationsSlice"
import { updateSession, cancelSession } from "@/lib/slices/mentorshipSlice"
import { CourseManagement } from "@/components/courses/course-management"

export function MentorDashboard() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { sessions } = useAppSelector((state) => state.mentorship)
  const { courses } = useAppSelector((state) => state.courses)

  const [activeTab, setActiveTab] = useState("overview")
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined)

  // Filter courses created by this mentor
  const myCourses = courses.filter((course) => course.instructor === user?.name)

  const mentorStats = [
    {
      title: "Total Sessions",
      value: user?.totalSessions?.toString() || "47",
      change: "+3 this week",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Average Rating",
      value: user?.rating?.toString() || "4.9",
      change: "+0.1 this month",
      icon: Star,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Monthly Earnings",
      value: `$${user?.monthlyEarnings?.toLocaleString() || "2,340"}`,
      change: "+12% this month",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Response Time",
      value: `${user?.responseTime || "2.3"}h`,
      change: "-0.5h improved",
      icon: Clock,
      color: "from-purple-500 to-purple-600",
    },
  ]

  const upcomingSessions = [
    {
      id: "1",
      mentee: "Sarah Johnson",
      topic: "Career Transition",
      time: "2:00 PM",
      date: "Today",
      avatar: "/placeholder.svg?height=40&width=40",
      meetingLink: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: "2",
      mentee: "Maria Garcia",
      topic: "Leadership Skills",
      time: "10:00 AM",
      date: "Tomorrow",
      avatar: "/placeholder.svg?height=40&width=40",
      meetingLink: "https://zoom.us/j/123456789",
    },
    {
      id: "3",
      mentee: "Aisha Patel",
      topic: "Work-Life Balance",
      time: "3:00 PM",
      date: "Jan 25",
      avatar: "/placeholder.svg?height=40&width=40",
      meetingLink: "https://teams.microsoft.com/l/meetup-join/...",
    },
  ]

  const handleJoinSession = (session: any) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, "_blank")

      // Update session status
      dispatch(
        updateSession({
          id: session.id,
          updates: { status: "in-progress" },
        }),
      )

      dispatch(
        addNotification({
          title: "Session Started",
          message: `You've joined the session with ${session.mentee}`,
          type: "info",
          read: false,
        }),
      )
    }
  }

  const handleRescheduleSession = (sessionId: string) => {
    // In a real app, this would open a date/time picker
    dispatch(
      updateSession({
        id: sessionId,
        updates: { status: "rescheduled" },
      }),
    )

    dispatch(
      addNotification({
        title: "Session Rescheduled",
        message: "Reschedule request sent to mentee",
        type: "success",
        read: false,
      }),
    )
  }

  const handleCancelSession = (sessionId: string) => {
    if (window.confirm("Are you sure you want to cancel this session?")) {
      dispatch(cancelSession(sessionId))

      dispatch(
        addNotification({
          title: "Session Cancelled",
          message: "The session has been cancelled",
          type: "info",
          read: false,
        }),
      )
    }
  }

  const handleCreateCourse = () => {
    setSelectedCourseId(undefined)
    setShowCourseModal(true)
  }

  const handleEditCourse = (courseId: string) => {
    setSelectedCourseId(courseId)
    setShowCourseModal(true)
  }

  const handleViewAnalytics = (courseId: string) => {
    router.push(`/courses/${courseId}/analytics`)
  }

  const handleViewCourseDetails = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Sessions */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-xl font-semibold font-poppins text-gray-900 mb-6">Upcoming Sessions</h3>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={session.avatar || "/placeholder.svg"}
                        alt={session.mentee}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{session.mentee}</h4>
                        <p className="text-sm text-gray-600">{session.topic}</p>
                        <p className="text-sm text-purple-600">
                          {session.date} at {session.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleJoinSession(session)}
                        className="px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors flex items-center"
                      >
                        <Video className="w-4 h-4 mr-1" />
                        Join
                      </button>
                      <button
                        onClick={() => handleRescheduleSession(session.id)}
                        className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancelSession(session.id)}
                        className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}

                {upcomingSessions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No upcoming sessions scheduled</div>
                )}
              </div>
            </div>

            {/* My Courses */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold font-poppins text-gray-900">My Courses</h3>
                <button
                  onClick={handleCreateCourse}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New
                </button>
              </div>
              <div className="space-y-4">
                {myCourses.map((course) => (
                  <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          course.students > 0 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {course.students > 0 ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{course.students} students</span>
                      <span>⭐ {course.rating}</span>
                      <span>${(course.students * 25).toLocaleString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewCourseDetails(course.id)}
                        className="flex-1 px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleEditCourse(course.id)}
                        className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewAnalytics(course.id)}
                        className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Analytics
                      </button>
                    </div>
                  </div>
                ))}

                {myCourses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">You haven't created any courses yet</div>
                )}
              </div>
            </div>
          </div>
        )

      case "sessions":
        return (
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold font-poppins text-gray-900">Session Management</h3>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Schedule New Session
              </button>
            </div>
            {/* Session management content */}
            <div className="text-center py-8 text-gray-500">Session management interface coming soon...</div>
          </div>
        )

      case "analytics":
        return (
          <div className="space-y-6">
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-xl font-semibold font-poppins text-gray-900 mb-6">Performance Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Session Growth</h4>
                  <p className="text-2xl font-bold text-green-600">+23%</p>
                  <p className="text-sm text-gray-600">vs last month</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Satisfaction Rate</h4>
                  <p className="text-2xl font-bold text-purple-600">96%</p>
                  <p className="text-sm text-gray-600">mentee satisfaction</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Avg Session</h4>
                  <p className="text-2xl font-bold text-blue-600">52min</p>
                  <p className="text-sm text-gray-600">session duration</p>
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
      {/* <div className="glass-effect rounded-xl p-6">
        <h1 className="text-2xl font-bold font-poppins gradient-text mb-2">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-600">Ready to inspire and guide your mentees today?</p>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mentorStats.map((stat) => {
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
              { id: "sessions", label: "Sessions" },
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

      {/* Course Management Modal */}
      {showCourseModal && <CourseManagement courseId={selectedCourseId} onClose={() => setShowCourseModal(false)} />}
    </div>
  )
}
