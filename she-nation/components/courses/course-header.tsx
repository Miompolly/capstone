"use client";

import { Star, Users, Clock, BookOpen } from "lucide-react";
import { useGetCourseByIdQuery } from "@/lib/api/coursesApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface CourseHeaderProps {
  courseId: string;
}

export function CourseHeader({ courseId }: CourseHeaderProps) {
  const {
    data: course,
    isLoading,
    error,
  } = useGetCourseByIdQuery(Number.parseInt(courseId));

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
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {course.title}
          </h2>
          <p className="text-gray-600 mb-4">by {course.instructor_name}</p>
        </div>
      </div>

      <div className="flex items-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center">
          <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
          {course.rating}
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {course.students} students
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {course.duration_weeks} weeks
        </div>
      </div>

      <p className="text-gray-700 mt-4">{course.description}</p>
    </div>
  );
}
