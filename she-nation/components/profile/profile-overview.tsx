"use client";

import { MapPin, Calendar } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useGetMentorBookingsQuery } from "@/lib/api/bookingApi";
import { useGetAllCoursesQuery } from "@/lib/api/coursesApi";

export function ProfileOverview() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: bookings = [] } = useGetMentorBookingsQuery();
  const { data: coursesData } = useGetAllCoursesQuery({});

  if (!user) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* About */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">About</h3>
          <p className="text-gray-700 leading-relaxed">
            {user.bio || "No bio provided yet."}
          </p>
        </div>

        {/* User Information */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>
              <p className="text-gray-900">{user.name || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-900">{user.phone || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Role</label>
              <p className="text-gray-900 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Contact Info */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-3" />
              <span className="text-sm">
                {user.location || "Location not set"}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-3" />
              <span className="text-sm">
                Joined{" "}
                {new Date(
                  user.date_registered || Date.now()
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Booking Stats - Only show if user has bookings */}
        {bookings.length > 0 && (
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Booking Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Bookings</span>
                <span className="font-semibold">{bookings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Confirmed Sessions
                </span>
                <span className="font-semibold">
                  {bookings.filter((b) => b.time).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Sessions</span>
                <span className="font-semibold">
                  {bookings.filter((b) => !b.time).length}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Course Stats - Only show if user has course data */}
        {coursesData &&
          coursesData.results &&
          coursesData.results.length > 0 && (
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Course Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Available Courses
                  </span>
                  <span className="font-semibold">
                    {coursesData.results.length}
                  </span>
                </div>
              </div>
            </div>
          )}

        {/* Quick Actions */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
              Edit Profile
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Download Resume
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Share Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
