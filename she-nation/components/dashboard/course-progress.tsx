"use client"

import { useAppSelector } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import { BookOpen, Play, CheckCircle } from "lucide-react"

export function CourseProgress() {
  const { courses } = useAppSelector((state) => state.courses)
  const router = useRouter()

  // Get enrolled courses
  const enrolledCourses = courses.filter((course) => course.enrolled)

  const handleContinue = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  const handleViewAll = () => {
    router.push("/courses?filter=enrolled")
  }

  const handleBrowseCourses = () => {
    router.push("/courses")
  }

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold font-poppins text-gray-900">Course Progress</h3>
        {enrolledCourses.length > 0 && (
          <button onClick={handleViewAll} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            View All
          </button>
        )}
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No enrolled courses yet</p>
          <button
            onClick={handleBrowseCourses}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {enrolledCourses.slice(0, 3).map((course) => (
            <div key={course.id} className="p-4 rounded-lg bg-white/50 border border-white/30">
              <div className="flex items-center space-x-4 mb-3">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <p className="text-sm text-gray-600">{course.instructor}</p>
                  <p className="text-xs text-gray-500">
                    {course.duration} • {course.level}
                  </p>
                </div>
                {course.progress === 100 && <CheckCircle className="w-6 h-6 text-green-500" />}
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-purple-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => handleContinue(course.id)}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                {course.progress === 0 ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Learning
                  </>
                ) : course.progress === 100 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Review Course
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Continue Learning
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
