"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { EnhancedBookingCalendar } from "@/components/mentorship/enhanced-booking-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar, Clock, Users } from "lucide-react";

function CalendarPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📅 My Calendar
        </h1>
        <p className="text-gray-600">
          View your scheduled mentorship sessions and join Google Meet calls
        </p>
      </div>

      {/* Quick Guide */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Video className="w-5 h-5" />
            How to Join Your Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium text-blue-800">Look for Video Icons</h3>
                <p className="text-sm text-blue-600">
                  Approved sessions show a <Video className="w-4 h-4 inline mx-1" /> icon
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium text-green-800">Click "Join" Button</h3>
                <p className="text-sm text-green-600">
                  Blue "Join" button opens Google Meet
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-medium text-purple-800">Start Your Session</h3>
                <p className="text-sm text-purple-600">
                  Google Meet opens in a new tab
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Legend */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Session Status Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Approved
              </Badge>
              <span className="text-sm text-gray-600">
                Ready to join - Google Meet link available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                Pending
              </Badge>
              <span className="text-sm text-gray-600">
                Waiting for mentor approval
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800 border-red-200">
                Denied
              </Badge>
              <span className="text-sm text-gray-600">
                Session was not approved
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Calendar */}
      <EnhancedBookingCalendar />

      {/* Additional Help */}
      <Card className="mt-6 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Can't see the Join button?</h4>
                <p className="text-sm text-gray-600">
                  Make sure your session is approved (green status). Only approved sessions have Google Meet links.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Want to add to your calendar?</h4>
                <p className="text-sm text-gray-600">
                  Click the green "Add" button to create a Google Calendar event with the meeting link included.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Session starting soon?</h4>
                <p className="text-sm text-gray-600">
                  Join the meeting 5-10 minutes early to test your audio and video setup.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CalendarPageWithAuth() {
  return (
    <AuthGuard allowedRoles={["mentor", "Mentor", "mentee", "admin"]}>
      <CalendarPage />
    </AuthGuard>
  );
}

export default CalendarPageWithAuth;
