import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Post {
  id: string
  title: string
  content: string
  author: string
  authorAvatar: string
  category: string
  likes: number
  replies: number
  createdAt: string
  tags: string[]
}

interface Reply {
  id: string
  postId: string
  content: string
  author: string
  authorAvatar: string
  createdAt: string
  likes: number
}

interface ForumState {
  posts: Post[]
  replies: Reply[]
  categories: string[]
  selectedCategory: string
}

const initialState: ForumState = {
  posts: [
    {
      id: "1",
      title: "How to negotiate salary as a woman in tech?",
      content: "I'm preparing for salary negotiations and would love to hear your experiences and tips.",
      author: "Jessica Wong",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      category: "Career",
      likes: 24,
      replies: 8,
      createdAt: "2024-01-20T10:30:00Z",
      tags: ["salary", "negotiation", "career"],
    },
    {
      id: "2",
      title: "Best resources for learning machine learning?",
      content: "Looking for recommendations on courses, books, and practical projects to get started with ML.",
      author: "Priya Sharma",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      category: "Learning",
      likes: 18,
      replies: 12,
      createdAt: "2024-01-19T14:15:00Z",
      tags: ["machine-learning", "resources", "learning"],
    },
    {
      id: "3",
      title: "Starting a tech company - what I wish I knew",
      content: "Sharing my journey and lessons learned from founding my first startup.",
      author: "Maria Rodriguez",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      category: "Entrepreneurship",
      likes: 45,
      replies: 15,
      createdAt: "2024-01-18T09:00:00Z",
      tags: ["startup", "entrepreneurship", "lessons"],
    },
  ],
  replies: [
    {
      id: "1",
      postId: "1",
      content:
        "Great question! I always research market rates first and prepare specific examples of my contributions.",
      author: "Sarah Kim",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      createdAt: "2024-01-20T11:00:00Z",
      likes: 5,
    },
  ],
  categories: ["Career", "Learning", "Entrepreneurship", "Technology", "Networking", "General"],
  selectedCategory: "",
}

const forumSlice = createSlice({
  name: "forum",
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Omit<Post, "id" | "likes" | "replies" | "createdAt">>) => {
      const newPost: Post = {
        ...action.payload,
        id: Date.now().toString(),
        likes: 0,
        replies: 0,
        createdAt: new Date().toISOString(),
      }
      state.posts.unshift(newPost)
    },
    likePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((p) => p.id === action.payload)
      if (post) {
        post.likes += 1
      }
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
    },
  },
})

export const { addPost, likePost, setSelectedCategory } = forumSlice.actions
export default forumSlice.reducer
