"use client"

import { useState } from "react"
import { Plus, Search, Filter, TrendingUp } from "lucide-react"
import { CreatePostModal } from "./create-post-modal"

export function ForumHeader() {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold font-poppins gradient-text mb-2">Community Forum</h1>
            <p className="text-gray-600">Connect, share, and learn with the SheNation community</p>
          </div>
          <button
            onClick={() => setShowCreatePost(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Start Discussion
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </button>
          </div>
        </div>

       

      </div>
      {showCreatePost && <CreatePostModal onClose={() => setShowCreatePost(false)} />}
    </>
  )
}
