"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Video,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export function GoogleMeetGuide() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Video className="w-6 h-6" />
          How to Join Your Google Meet Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step-by-step guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800 mb-2">
              1. Get Approved
            </h3>
            <p className="text-sm text-blue-600">
              Wait for your mentor to approve your booking request
            </p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-800 mb-2">
              2. Check Calendar
            </h3>
            <p className="text-sm text-green-600">
              Look for the video icon on approved sessions
            </p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-purple-800 mb-2">
              3. Choose Platform
            </h3>
            <p className="text-sm text-purple-600">
              Select Google Meet, Zoom, or Teams to start your meeting
            </p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg border border-orange-100">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ExternalLink className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-orange-800 mb-2">
              4. Start Session
            </h3>
            <p className="text-sm text-orange-600">
              Google Meet opens in a new tab - you're ready!
            </p>
          </div>
        </div>

        {/* Where to find join buttons */}
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Where to Find Join Buttons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">📅 Calendar View</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Look for <Video className="w-3 h-3 inline mx-1" /> icons on
                  approved sessions
                </li>
                <li>• "Start Meeting" dropdown with platform options</li>
                <li>• Hover tooltips show meeting details</li>
              </ul>
              <Link href="/calendar">
                <Button variant="outline" size="sm" className="w-full">
                  Go to Calendar <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">
                📋 Booking Dashboard
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Blue video icon in actions column</li>
                <li>• "Google Meet Ready" section for approved bookings</li>
                <li>• Direct "Click here to join meeting" links</li>
              </ul>
              <Link href="/mentor-bookings">
                <Button variant="outline" size="sm" className="w-full">
                  Go to Bookings <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <h3 className="font-semibold text-gray-800 mb-3">
            Session Status Guide
          </h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Approved
              </Badge>
              <span className="text-sm text-gray-600">
                Google Meet link available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </Badge>
              <span className="text-sm text-gray-600">
                Waiting for approval
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800 border-red-200">
                <AlertCircle className="w-3 h-3 mr-1" />
                Denied
              </Badge>
              <span className="text-sm text-gray-600">
                Session not approved
              </span>
            </div>
          </div>
        </div>

        {/* Quick tips */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Quick Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Join 5-10 minutes early to test your setup</li>
            <li>• Make sure your camera and microphone are working</li>
            <li>• Use a quiet space with good lighting</li>
            <li>• Have a stable internet connection</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
