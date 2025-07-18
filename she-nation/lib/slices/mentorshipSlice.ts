import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Mentor {
  id: string
  name: string
  avatar: string
  experience: string
  rating: number
  price: number
  expertise: string[]
  availability: string[]
  bio: string
  location: string
  languages: string[]
  responseTime: string
}

interface Session {
  id: string
  mentorId: string
  mentorName: string
  mentorAvatar: string
  topic: string
  date: string
  time: string
  duration: number
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"
  notes?: string
  meetingLink?: string
}

interface MentorshipState {
  mentors: Mentor[]
  sessions: Session[]
  selectedMentor: Mentor | null
  filters: {
    expertise: string[]
    priceRange: [number, number]
    rating: number
    availability: string
    location: string
  }
  searchQuery: string
  loading: boolean
  error: string | null
}

const initialState: MentorshipState = {
  mentors: [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      experience: "Senior Product Manager at Google",
      rating: 4.9,
      price: 150,
      expertise: ["Product Management", "Leadership", "Strategy"],
      availability: ["Monday 2-4 PM", "Wednesday 10-12 PM", "Friday 3-5 PM"],
      bio: "Experienced product leader with 10+ years at top tech companies.",
      location: "San Francisco, CA",
      languages: ["English", "Spanish"],
      responseTime: "2 hours",
    },
    {
      id: "2",
      name: "Maria Rodriguez",
      avatar: "/placeholder.svg?height=100&width=100",
      experience: "VP of Engineering at Microsoft",
      rating: 4.8,
      price: 200,
      expertise: ["Engineering Management", "Technical Leadership", "Career Growth"],
      availability: ["Tuesday 1-3 PM", "Thursday 9-11 AM", "Saturday 2-4 PM"],
      bio: "Engineering leader passionate about mentoring women in tech.",
      location: "Seattle, WA",
      languages: ["English", "Portuguese"],
      responseTime: "1 hour",
    },
    {
      id: "3",
      name: "Dr. Aisha Patel",
      avatar: "/placeholder.svg?height=100&width=100",
      experience: "Data Science Director at Netflix",
      rating: 4.9,
      price: 175,
      expertise: ["Data Science", "Machine Learning", "Analytics"],
      availability: ["Monday 10-12 PM", "Wednesday 2-4 PM", "Friday 1-3 PM"],
      bio: "Data science expert with expertise in ML and AI applications.",
      location: "Los Angeles, CA",
      languages: ["English", "Hindi"],
      responseTime: "3 hours",
    },
  ],
  sessions: [
    {
      id: "1",
      mentorId: "1",
      mentorName: "Dr. Sarah Johnson",
      mentorAvatar: "/placeholder.svg?height=40&width=40",
      topic: "Product Strategy Discussion",
      date: "2024-01-25",
      time: "2:00 PM",
      duration: 60,
      status: "scheduled",
      meetingLink: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: "2",
      mentorId: "2",
      mentorName: "Maria Rodriguez",
      mentorAvatar: "/placeholder.svg?height=40&width=40",
      topic: "Career Growth Planning",
      date: "2024-01-20",
      time: "1:00 PM",
      duration: 45,
      status: "completed",
      notes: "Great session on career planning and next steps.",
    },
  ],
  selectedMentor: null,
  filters: {
    expertise: [],
    priceRange: [0, 500],
    rating: 0,
    availability: "",
    location: "",
  },
  searchQuery: "",
  loading: false,
  error: null,
}

const mentorshipSlice = createSlice({
  name: "mentorship",
  initialState,
  reducers: {
    setMentors: (state, action: PayloadAction<Mentor[]>) => {
      state.mentors = action.payload
    },
    selectMentor: (state, action: PayloadAction<Mentor>) => {
      state.selectedMentor = action.payload
    },
    bookSession: (state, action: PayloadAction<Omit<Session, "id">>) => {
      const newSession: Session = {
        ...action.payload,
        id: Date.now().toString(),
        status: "scheduled",
      }
      state.sessions.push(newSession)
    },
    updateSession: (state, action: PayloadAction<{ id: string; updates: Partial<Session> }>) => {
      const { id, updates } = action.payload
      const sessionIndex = state.sessions.findIndex((session) => session.id === id)
      if (sessionIndex !== -1) {
        state.sessions[sessionIndex] = { ...state.sessions[sessionIndex], ...updates }
      }
    },
    cancelSession: (state, action: PayloadAction<string>) => {
      const sessionIndex = state.sessions.findIndex((session) => session.id === action.payload)
      if (sessionIndex !== -1) {
        state.sessions[sessionIndex].status = "cancelled"
      }
    },
    rescheduleSession: (state, action: PayloadAction<{ id: string; date: string; time: string }>) => {
      const { id, date, time } = action.payload
      const sessionIndex = state.sessions.findIndex((session) => session.id === id)
      if (sessionIndex !== -1) {
        state.sessions[sessionIndex] = {
          ...state.sessions[sessionIndex],
          date,
          time,
          status: "rescheduled",
        }
      }
    },
    setFilters: (state, action: PayloadAction<Partial<MentorshipState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
      state.searchQuery = ""
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setMentors,
  selectMentor,
  bookSession,
  updateSession,
  cancelSession,
  rescheduleSession,
  setFilters,
  setSearchQuery,
  clearFilters,
  setLoading,
  setError,
} = mentorshipSlice.actions

export default mentorshipSlice.reducer
