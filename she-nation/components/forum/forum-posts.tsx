"use client"

import { Heart, MessageCircle, Share2, MoreHorizontal, Pin } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { likePost } from "@/lib/slices/forumSlice"

export function ForumPosts() {
  const { posts, selectedCategory } = useAppSelector((state) => state.forum)
  const dispatch = useAppDispatch()

  const filteredPosts = selectedCategory ? posts.filter((post) => post.category === selectedCategory) : posts

  const handleLike = (postId: string) => {
    dispatch(likePost(postId))
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Pinned Posts */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center mb-4">
          <Pin className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Pinned Posts</h3>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">Welcome to SheNation Community Forum! 📢</h4>
          <p className="text-purple-700 text-sm">
            Please read our community guidelines and introduce yourself to get started.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            {filteredPosts.length} {filteredPosts.length === 1 ? "discussion" : "discussions"}
            {selectedCategory && ` in ${selectedCategory}`}
          </span>
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option>Sort by: Latest</option>
          <option>Sort by: Most Popular</option>
          <option>Sort by: Most Replies</option>
          <option>Sort by: Oldest</option>
        </select>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="glass-effect rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start space-x-4">
              <img src={post.authorAvatar || "/placeholder.svg"} alt={post.author} className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{post.author}</h3>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{getTimeAgo(post.createdAt)}</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-purple-600 cursor-pointer transition-colors">
                  {post.title}
                </h2>

                <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.replies}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium">
                    View Discussion
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
