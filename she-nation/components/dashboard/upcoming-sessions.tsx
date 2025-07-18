"use client"

import { Calendar, Clock, Video, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateSession } from "@/lib/slices/mentorshipSlice"
import { addNotification } from "@/lib/slices/notificationsSlice"

export function UpcomingSessions() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { sessions } = useAppSelector((state) => state.mentorship)

  const upcomingSessions = sessions.filter((session) => session.status === "scheduled").slice(0, 3)

  const handleJoinSession = (session: any) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, "_blank")

      dispatch(
        updateSession({
          id: session.id,
          updates: { status: "in-progress" },
        }),
      )

      dispatch(
        addNotification({
          title: "Session Started",
          message: `Joined session: ${session.topic}`,
          type: "info",
          read: false,
        }),
      )
    } else {
      dispatch(
        addNotification({
          title: "Meeting Link Unavailable",
          message: "The meeting link is not available yet. Please try again later.",
          type: "error",
          read: false,
        }),
      )
    }
  }

  const handleViewAllSessions = () => {
    router.push("/sessions")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-600"
      case "completed":
        return "bg-green-100 text-green-600"
      case "cancelled":
        return "bg-red-100 text-red-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="glass-effect rounded-xl p-6 hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold font-poppins text-gray-900">Upcoming Sessions</h3>
        <button onClick={handleViewAllSessions} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
          View All
        </button>
      </div>

      {upcomingSessions.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No upcoming sessions</p>
          <button
            onClick={() => router.push("/mentorship")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Book a Session
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="p-4 rounded-lg bg-white/50 border border-white/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={session.mentorAvatar || "/placeholder.svg"}
                    alt={session.mentorName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{session.topic}</h4>
                    <p className="text-sm text-gray-600">with {session.mentorName}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                  {session.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(session.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {session.time}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleJoinSession(session)}
                  className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Join Session
                </button>
                <button
                  onClick={() => router.push("/sessions")}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
