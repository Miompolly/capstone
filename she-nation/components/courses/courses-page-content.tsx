"use client";

import { useState, useMemo } from "react";
import { Search, Grid, List, BookOpen, Plus } from "lucide-react";
import { useGetAllCoursesQuery } from "@/lib/api/coursesApi";
import { useGetAllEnrollmentsQuery } from "@/lib/api/enrollmentsApi";
import { useCreateEnrollmentMutation } from "@/lib/api/enrollmentsApi";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { addNotification } from "@/lib/slices/notificationsSlice";
import { CourseGrid } from "./course-grid";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CourseManagement } from "./course-management";

export function CoursesPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const {
    data: courses = [],
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetAllCoursesQuery();
  const { data: enrollments = [], isLoading: enrollmentsLoading } =
    useGetAllEnrollmentsQuery();
  const [createEnrollment] = useCreateEnrollmentMutation();
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(
    undefined
  );
  const [showCourseModal, setShowCourseModal] = useState(false);

  // Get unique categories and levels from courses
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(courses.map((course) => course.category)),
    ];
    return uniqueCategories.filter(Boolean);
  }, [courses]);

  const levels = useMemo(() => {
    const uniqueLevels = [...new Set(courses.map((course) => course.level))];
    return uniqueLevels.filter(Boolean);
  }, [courses]);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || course.category === selectedCategory;
      const matchesLevel = !selectedLevel || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });

    // Sort courses
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "oldest":
        filtered.sort((a, b) => a.id - b.id);
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "price":
        filtered.sort(
          (a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price)
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy]);

  // Add enrollment status to courses
  const coursesWithEnrollment = useMemo(() => {
    return filteredCourses.map((course) => {
      const enrollment = enrollments.find(
        (e) => e.course === course.id && e.user === user?.name
      );
      return {
        ...course,
        enrolled: !!enrollment,
        progress: enrollment?.progress || 0,
        enrollmentId: enrollment?.id,
      };
    });
  }, [filteredCourses, enrollments, user]);

  const handleCreateCourse = () => {
    setSelectedCourseId(undefined);
    setShowCourseModal(true);
  };

  const handleEnrollCourse = async (courseId: number) => {
    if (!user) {
      dispatch(
        addNotification({
          title: "Login Required",
          message: "Please log in to enroll in courses",
          type: "error",
          read: false,
        })
      );
      return;
    }

    try {
      await createEnrollment({ course: courseId }).unwrap();
      dispatch(
        addNotification({
          title: "Enrollment Successful",
          message: "You have been enrolled in the course successfully",
          type: "success",
          read: false,
        })
      );
    } catch (error: any) {
      const errorMessage = error?.data?.detail || "Failed to enroll in course";
      dispatch(
        addNotification({
          title: "Enrollment Failed",
          message: errorMessage,
          type: "error",
          read: false,
        })
      );
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLevel("");
    setSortBy("newest");
  };

  if (coursesLoading || enrollmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Error Loading Courses
        </h3>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  console.log(user.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold font-poppins gradient-text mb-4">
          Explore Courses
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover a wide range of courses designed to empower your career and
          personal growth.
        </p>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold font-poppins text-gray-900">
            My Courses
          </h3>
          {(user?.role === "Mentor" || user?.role === "Expert" )&& (
            <button
              onClick={handleCreateCourse}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Levels</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="price">Price Low-High</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {(searchQuery || selectedCategory || selectedLevel) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            {coursesWithEnrollment.length} course
            {coursesWithEnrollment.length !== 1 ? "s" : ""} found
          </span>
          {user && (
            <span>
              {enrollments.length} enrolled course
              {enrollments.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {showCourseModal && (
        <CourseManagement
          courseId={selectedCourseId}
          onClose={() => setShowCourseModal(false)}
        />
      )}

      {/* Course Grid */}
      <CourseGrid
        courses={coursesWithEnrollment}
        viewMode={viewMode}
        onEnroll={handleEnrollCourse}
      />
    </div>
  );
}
