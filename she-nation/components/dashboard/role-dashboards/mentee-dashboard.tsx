"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Calendar,
  Users,
  TrendingUp,
  Award,
  Plus,
  Video,
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks";

export default function MenteeDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  // Mock data for now to avoid API issues during build
  const analytics = {
    enrolledCourses: 1,
    totalSessions: 4,
    learningProgress: 0,
    certificates: 0,
    monthlyGrowth: {
      coursesEnrolled: 1,
      sessionsCompleted: 0,
    },
    upcomingSessions: [
      {
        id: "1",
        mentor: "MINANI",
        topic: "Pop Ballon",
        time: "11:30 AM",
        date: "Tomorrow",
        meetingLink: "https://meet.google.com/coi-vodj-pdx",
        type: "1-on-1" as const,
        status: "approved",
      },
    ],
    courseProgress: [
      {
        id: "3",
        title: "Hello",
        instructor: "MINANI",
        progress: 0,
        nextLesson: "Course Complete",
      },
    ],
  };

  const menteeStats = [
    {
      title: "Courses Enrolled",
      value: analytics.enrolledCourses.toString(),
      change: `+${analytics.monthlyGrowth.coursesEnrolled} this month`,
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Mentorship Sessions",
      value: analytics.totalSessions.toString(),
      change: `+${analytics.monthlyGrowth.sessionsCompleted} completed this month`,
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Learning Progress",
      value: `${analytics.learningProgress}%`,
      change: analytics.learningProgress > 0 ? "Keep going!" : "Start learning today",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Certificates Earned",
      value: analytics.certificates.toString(),
      change: analytics.certificates > 0 ? "Great achievement!" : "Complete courses to earn",
      icon: Award,
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  const handleJoinSession = (session: any) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, "_blank");
    }
  };

  const handleBookMentor = () => {
    router.push("/mentorship");
  };

  const handleViewAllCourses = () => {
    router.push("/courses");
  };

  const handleContinueCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h3>
                <button
                  onClick={handleBookMentor}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Book Session
                </button>
              </div>
              <div className="space-y-4">
                {analytics.upcomingSessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No upcoming sessions scheduled</p>
                    <button
                      onClick={handleBookMentor}
                      className="mt-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Book your first session
                    </button>
                  </div>
                ) : (
                  analytics.upcomingSessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{session.topic}</h4>
                          <p className="text-sm text-gray-600">with {session.mentor}</p>
                          <p className="text-sm text-purple-600">{session.date} at {session.time}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoinSession(session)}
                        className="px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors flex items-center"
                      >
                        <Video className="w-4 h-4 mr-1" />
                        Join
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Course Progress</h3>
                <button
                  onClick={handleViewAllCourses}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {analytics.courseProgress.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No courses enrolled yet</p>
                    <button
                      onClick={handleViewAllCourses}
                      className="mt-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Browse available courses
                    </button>
                  </div>
                ) : (
                  analytics.courseProgress.slice(0, 3).map((course) => (
                    <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                        <span className="text-sm text-purple-600 font-medium">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Next: {course.nextLesson}</span>
                        <button
                          onClick={() => handleContinueCourse(course.id)}
                          className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case "courses":
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">My Courses</h3>
              <button
                onClick={handleViewAllCourses}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Browse Courses
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analytics.courseProgress.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Yet</h3>
                  <p className="mb-4">Start your learning journey by enrolling in a course</p>
                  <button
                    onClick={handleViewAllCourses}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                analytics.courseProgress.map((course) => (
                  <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">by {course.instructor}</p>
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Next: {course.nextLesson}</span>
                        <button
                          onClick={() => handleContinueCourse(course.id)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return <div>Content for {activeTab}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || "Mentee"}!
            </h1>
            <p className="text-gray-600 mt-2">
              Continue your learning journey and track your progress
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menteeStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "courses", label: "My Courses" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
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
          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
