"use client"

import { Hash, TrendingUp, Users, Award } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setSelectedCategory } from "@/lib/slices/forumSlice"

export function ForumSidebar() {
  const { categories, selectedCategory } = useAppSelector((state) => state.forum)
  const dispatch = useAppDispatch()

  const topContributors = [
    { name: "Sarah Johnson", posts: 156, avatar: "/placeholder.svg?height=40&width=40" },
    { name: "Emily Chen", posts: 142, avatar: "/placeholder.svg?height=40&width=40" },
    { name: "Maria Rodriguez", posts: 128, avatar: "/placeholder.svg?height=40&width=40" },
    { name: "Aisha Patel", posts: 115, avatar: "/placeholder.svg?height=40&width=40" },
  ]

  const trendingTopics = [
    { tag: "career-growth", posts: 45 },
    { tag: "networking", posts: 38 },
    { tag: "leadership", posts: 32 },
    { tag: "work-life-balance", posts: 28 },
    { tag: "entrepreneurship", posts: 24 },
  ]

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Hash className="w-5 h-5 mr-2" />
          Categories
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => dispatch(setSelectedCategory(""))}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              !selectedCategory ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"
            }`}
          >
            All Discussions
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => dispatch(setSelectedCategory(category))}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === category ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Trending Topics
        </h3>
        <div className="space-y-3">
          {trendingTopics.map((topic) => (
            <div key={topic.tag} className="flex items-center justify-between">
              <span className="text-purple-600 hover:text-purple-700 cursor-pointer">#{topic.tag}</span>
              <span className="text-sm text-gray-500">{topic.posts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Top Contributors
        </h3>
        <div className="space-y-4">
          {topContributors.map((contributor, index) => (
            <div key={contributor.name} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <img
                  src={contributor.avatar || "/placeholder.svg"}
                  alt={contributor.name}
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{contributor.name}</p>
                <p className="text-xs text-gray-500">{contributor.posts} posts</p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                  {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Community Guidelines
        </h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Be respectful and supportive</li>
          <li>• Stay on topic and relevant</li>
          <li>• No spam or self-promotion</li>
          <li>• Use appropriate language</li>
          <li>• Help others learn and grow</li>
        </ul>
      </div>
    </div>
  )
}
