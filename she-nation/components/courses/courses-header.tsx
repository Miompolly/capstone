"use client"

import { Search, Filter } from "lucide-react"
import { useState } from "react"

export function CoursesHeader() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold font-poppins gradient-text mb-4">Discover Your Next Skill</h1>
      <p className="text-gray-600 mb-6">
        Access world-class courses designed by industry experts to accelerate your career growth
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, instructors, or topics..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/70 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center px-6 py-3 bg-white/70 backdrop-blur-sm border border-white/50 rounded-lg hover:bg-white/90 transition-colors">
          <Filter className="w-5 h-5 mr-2 text-gray-600" />
          Advanced Filters
        </button>
      </div>
    </div>
  )
}
