"use client"

import { useGetMenteeAnalyticsQuery } from "@/lib/api/analyticsApi"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function TestAnalyticsPage() {
  const { data: analytics, isLoading, error } = useGetMenteeAnalyticsQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Analytics</h1>
          <pre className="text-sm text-gray-600 bg-gray-100 p-4 rounded">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics API Test</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Raw Analytics Data</h2>
        <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(analytics, null, 2)}
        </pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Enrolled Courses</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics?.enrolledCourses}</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Total Sessions</h3>
          <p className="text-3xl font-bold text-purple-600">{analytics?.totalSessions}</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Learning Progress</h3>
          <p className="text-3xl font-bold text-green-600">{analytics?.learningProgress}%</p>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Certificates</h3>
          <p className="text-3xl font-bold text-yellow-600">{analytics?.certificates}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Course Progress</h3>
          {analytics?.courseProgress?.length === 0 ? (
            <p className="text-gray-500">No courses enrolled</p>
          ) : (
            <div className="space-y-4">
              {analytics?.courseProgress?.map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold">{course.title}</h4>
                  <p className="text-sm text-gray-600">by {course.instructor}</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Next: {course.nextLesson}</p>
                  <p className="text-sm text-gray-500">Due: {course.dueDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Learning Goals</h3>
          {analytics?.learningGoals?.length === 0 ? (
            <p className="text-gray-500">No learning goals set</p>
          ) : (
            <div className="space-y-4">
              {analytics?.learningGoals?.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{goal.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      goal.priority === 'high' ? 'bg-red-100 text-red-600' :
                      goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {goal.priority}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Deadline: {goal.deadline}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming Sessions</h3>
          {analytics?.upcomingSessions?.length === 0 ? (
            <p className="text-gray-500">No upcoming sessions</p>
          ) : (
            <div className="space-y-4">
              {analytics?.upcomingSessions?.map((session) => (
                <div key={session.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{session.topic}</h4>
                    <p className="text-sm text-gray-600">with {session.mentor}</p>
                    <p className="text-sm text-gray-500">{session.date} at {session.time}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    session.type === '1-on-1' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {session.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
