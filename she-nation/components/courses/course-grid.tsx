"use client";

import { BarChart3, BookOpen, Calendar, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import type { AllCoursesResponse } from "@/lib/types/api";
import { CourseManagement } from "./course-management";
import { useState } from "react";

interface CourseGridProps {
  courses: AllCoursesResponse;
  viewMode: "grid" | "list";
  onEnroll: (courseId: number) => void;
}

export function CourseGrid({ courses, viewMode, onEnroll }: CourseGridProps) {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(
    undefined
  );

  const handleViewCourse = (courseId: number) => {
    router.push(`/courses/${courseId}`);
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-600";
      case "intermediate":
        return "bg-yellow-100 text-yellow-600";
      case "advanced":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleEditCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setShowCourseModal(true);
  };

  const handleViewCourseDetails = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  const formatPrice = (price: string) => {
    const numPrice = Number.parseFloat(price);
    return numPrice === 0 ? "Free" : `$${numPrice}`;
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No courses found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search criteria or filters.
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start space-x-6">
              <div className="w-32 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      by {course.instructor_name}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getLevelColor(
                      course.level
                    )}`}
                  >
                    {course.level}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {course.duration_weeks} weeks
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                    {course.category}
                  </span>
                  <span className="font-semibold text-purple-600">
                    {formatPrice(course.price)}
                  </span>
                  {course.certificate_available && (
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                      Certificate Available
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleViewCourseDetails(course.id.toString())
                    }
                    className="flex-1 px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEditCourse(course.id.toString())}
                    className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
        >
          <div className="relative">
            <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-purple-600" />
            </div>
            <span
              className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full ${getLevelColor(
                course.level
              )}`}
            >
              {course.level}
            </span>
            {course.certificate_available && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                Certificate
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-gray-600 text-sm">
                by {course.instructor_name}
              </p>
            </div>

            <p className="text-gray-700 text-sm mb-4 line-clamp-3">
              {course.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {course.duration_weeks}w
              </div>
              <span className="font-semibold text-purple-600">
                {formatPrice(course.price)}
              </span>
            </div>

            <div className="mb-4">
              <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                {course.category}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleViewCourseDetails(course.id.toString())}
                className="flex-1 px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => handleEditCourse(course.id.toString())}
                className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </button>
            </div>
          </div>
        </div>
      ))}
      {showCourseModal && (
        <CourseManagement
          courseId={selectedCourseId}
          onClose={() => setShowCourseModal(false)}
        />
      )}
    </div>
  );
}
