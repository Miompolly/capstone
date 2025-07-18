"use client";

import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";

export function sessionsOverview() {
  const { sessions } = useAppSelector((state) => state.mentorship);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-600";
      case "completed":
        return "bg-green-100 text-green-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-xl font-semibold font-poppins text-gray-900 mb-6">
        Your sessions
      </h3>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-4 rounded-lg bg-white/50 border border-white/30"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">
                {session.mentorName}
              </h4>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  session.status
                )}`}
              >
                {session.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3">{session.topic}</p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(session.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                {getStatusIcon(session.status)}
                <span className="ml-1">{session.time}</span>
              </div>
            </div>

            {session.status === "scheduled" && (
              <div className="flex space-x-2 mt-3">
                <button className="flex-1 px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                  Reschedule
                </button>
                <button className="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm">
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
