"use client";

import { useState } from "react";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  CheckCircle,
  Plus,
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useGetCourseByIdQuery } from "@/lib/api/coursesApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface CourseSidebarProps {
  courseId: string;
}

export function CourseSidebar({ courseId }: CourseSidebarProps) {
  const {
    data: course,
    isLoading,
    error,
  } = useGetCourseByIdQuery(Number.parseInt(courseId));
  const { user } = useAppSelector((state) => state.auth);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Error Loading Course
        </h3>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Course Content
      </h3>
      <div className="space-y-3">
        {/* Mock Lesson Data - Replace with API data */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Video className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">Introduction</span>
          </div>
          <span className="text-xs text-gray-500">15 min</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">Course Resources</span>
          </div>
          <span className="text-xs text-gray-500">5 pages</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Download className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">Exercise File</span>
          </div>
          <span className="text-xs text-gray-500">1 file</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">Quiz</span>
          </div>
          <span className="text-xs text-gray-500">10 questions</span>
        </div>

        {user?.role === "mentor" && (
          <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Lesson
          </button>
        )}
      </div>
    </div>
  );
}
