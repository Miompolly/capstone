"use client";

import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { BookingAnalyticsDashboard } from "@/components/mentorship/booking-analytics-dashboard";

function MentorAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Booking Analytics
              </h1>
              <p className="text-gray-600">
                Insights and statistics about your mentorship bookings
              </p>
            </div>
          </div>
        </div>

        {/* Key Features Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Performance Metrics</h3>
            </div>
            <p className="text-sm text-gray-600">
              Track your approval rates, response times, and booking trends over time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Mentee Insights</h3>
            </div>
            <p className="text-sm text-gray-600">
              See which mentees book with you most frequently and engagement patterns.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Booking Patterns</h3>
            </div>
            <p className="text-sm text-gray-600">
              Understand monthly trends and seasonal patterns in your bookings.
            </p>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <BookingAnalyticsDashboard />
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💡 Tips to Improve Your Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Increase Approval Rate</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Set clear availability in your profile</li>
                <li>• Respond to requests promptly</li>
                <li>• Communicate your mentoring focus areas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Reduce Response Time</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Enable email notifications</li>
                <li>• Check your dashboard regularly</li>
                <li>• Use bulk actions for multiple requests</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MentorAnalyticsPageWithAuth() {
  return (
    <AuthGuard allowedRoles={["mentor", "Mentor", "admin"]}>
      <MentorAnalyticsPage />
    </AuthGuard>
  );
}
