"use client"

import { Star, Users, Clock } from "lucide-react"
import Link from "next/link"

const featuredCourses = [
  {
    id: "featured-1",
    title: "Women in Leadership: Executive Presence",
    instructor: "Dr. Emily Chen",
    image: "/placeholder.svg?height=200&width=350",
    rating: 4.9,
    students: 2500,
    duration: "6 weeks",
    price: "Free",
    badge: "Most Popular",
  },
  {
    id: "featured-2",
    title: "AI & Machine Learning Fundamentals",
    instructor: "Aisha Patel",
    image: "/placeholder.svg?height=200&width=350",
    rating: 4.8,
    students: 1800,
    duration: "8 weeks",
    price: "$199",
    badge: "New",
  },
  {
    id: "featured-3",
    title: "Startup Fundraising Masterclass",
    instructor: "Maria Rodriguez",
    image: "/placeholder.svg?height=200&width=350",
    rating: 4.9,
    students: 1200,
    duration: "4 weeks",
    price: "$299",
    badge: "Expert Level",
  },
]

export function FeaturedCourses() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold font-poppins text-gray-900 mb-6">Featured Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCourses.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`}>
            <div className="group glass-effect rounded-xl overflow-hidden hover-lift transition-all duration-300">
              <div className="relative">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium rounded-full">
                    {course.badge}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold rounded-full">
                    {course.price}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-purple-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">by {course.instructor}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {course.rating}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.students.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
