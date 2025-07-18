"use client";

import { Calendar } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useGetMentorBookingsQuery } from "@/lib/api/bookingApi";

export function ProfileActivity() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: bookings = [] } = useGetMentorBookingsQuery();

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="space-y-6">
      {/* Real Booking Activity */}
      {bookings.length > 0 ? (
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6">Recent Bookings</h3>
          <div className="space-y-4">
            {bookings.slice(0, 10).map((booking) => (
              <div key={booking.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 rounded-lg bg-gray-50 text-purple-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      {booking.title || "Session Booking"}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {getTimeAgo(booking.day)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {user?.role === "mentee"
                      ? `Mentor: ${booking.mentor}`
                      : `Mentee: ${booking.mentee}`}
                    {booking.time && ` • ${booking.time}`}
                  </p>
                  {booking.note && (
                    <p className="text-sm text-gray-500 mt-1">{booking.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6">Activity Timeline</h3>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No activity to display yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Your bookings and activities will appear here.
            </p>
          </div>
        </div>
      )}

      {/* User Registration Activity */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6">Account Information</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 p-2 rounded-lg bg-gray-50 text-green-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Account Created</h4>
                <span className="text-sm text-gray-500">
                  {getTimeAgo(
                    user?.date_registered || new Date().toISOString()
                  )}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Joined SheNation as {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
