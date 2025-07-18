import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Job {
  id: string
  title: string
  company: string
  logo: string
  location: string
  type: "Full-time" | "Part-time" | "Contract" | "Remote"
  category: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: string
  applicationDeadline: string
  featured: boolean
  applicationsCount: number
  viewsCount: number
  status: "active" | "paused" | "closed"
}

interface Application {
  id: string
  jobId: string
  candidateName: string
  candidateEmail: string
  resume: string
  coverLetter: string
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired"
  appliedDate: string
}

interface JobsState {
  jobs: Job[]
  applications: Application[]
  searchQuery: string
  filters: {
    type: string
    location: string
    category: string
    salaryRange: [number, number]
    experience: string
  }
  loading: boolean
  error: string | null
}

const initialState: JobsState = {
  jobs: [
    {
      id: "1",
      title: "Senior Product Manager",
      company: "TechCorp Inc.",
      logo: "/placeholder.svg?height=60&width=60",
      location: "San Francisco, CA",
      type: "Full-time",
      category: "Product Management",
      salary: "$120,000 - $160,000",
      description: "We are looking for an experienced Product Manager to lead our core product initiatives...",
      requirements: ["5+ years product management experience", "Strong analytical skills", "Leadership experience"],
      benefits: ["Health insurance", "Stock options", "Flexible PTO", "Remote work options"],
      postedDate: "2024-01-20",
      applicationDeadline: "2024-02-20",
      featured: true,
      applicationsCount: 23,
      viewsCount: 156,
      status: "active",
    },
    {
      id: "2",
      title: "Lead Data Scientist",
      company: "DataFlow Solutions",
      logo: "/placeholder.svg?height=60&width=60",
      location: "New York, NY",
      type: "Full-time",
      category: "Data Science",
      salary: "$130,000 - $170,000",
      description: "Join our data science team to build cutting-edge ML models and analytics solutions...",
      requirements: ["PhD in Data Science or related field", "Python/R expertise", "ML/AI experience"],
      benefits: ["Competitive salary", "Learning budget", "Health benefits", "Equity package"],
      postedDate: "2024-01-18",
      applicationDeadline: "2024-02-18",
      featured: true,
      applicationsCount: 18,
      viewsCount: 134,
      status: "active",
    },
  ],
  applications: [],
  searchQuery: "",
  filters: {
    type: "",
    location: "",
    category: "",
    salaryRange: [0, 300000],
    experience: "",
  },
  loading: false,
  error: null,
}

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload
    },
    addJob: (state, action: PayloadAction<Omit<Job, "id">>) => {
      const newJob: Job = {
        ...action.payload,
        id: Date.now().toString(),
        applicationsCount: 0,
        viewsCount: 0,
        status: "active",
      }
      state.jobs.push(newJob)
    },
    updateJob: (state, action: PayloadAction<{ id: string; updates: Partial<Job> }>) => {
      const { id, updates } = action.payload
      const jobIndex = state.jobs.findIndex((job) => job.id === id)
      if (jobIndex !== -1) {
        state.jobs[jobIndex] = { ...state.jobs[jobIndex], ...updates }
      }
    },
    deleteJob: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter((job) => job.id !== action.payload)
    },
    applyToJob: (state, action: PayloadAction<Omit<Application, "id" | "appliedDate">>) => {
      const newApplication: Application = {
        ...action.payload,
        id: Date.now().toString(),
        status: "pending",
        appliedDate: new Date().toISOString(),
      }
      state.applications.push(newApplication)

      // Update job application count
      const jobIndex = state.jobs.findIndex((job) => job.id === action.payload.jobId)
      if (jobIndex !== -1) {
        state.jobs[jobIndex].applicationsCount += 1
      }
    },
    updateApplication: (state, action: PayloadAction<{ id: string; updates: Partial<Application> }>) => {
      const { id, updates } = action.payload
      const applicationIndex = state.applications.findIndex((app) => app.id === id)
      if (applicationIndex !== -1) {
        state.applications[applicationIndex] = { ...state.applications[applicationIndex], ...updates }
      }
    },
    incrementJobViews: (state, action: PayloadAction<string>) => {
      const jobIndex = state.jobs.findIndex((job) => job.id === action.payload)
      if (jobIndex !== -1) {
        state.jobs[jobIndex].viewsCount += 1
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<JobsState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
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
  setJobs,
  addJob,
  updateJob,
  deleteJob,
  applyToJob,
  updateApplication,
  incrementJobViews,
  setSearchQuery,
  setFilters,
  clearFilters,
  setLoading,
  setError,
} = jobsSlice.actions

export default jobsSlice.reducer
