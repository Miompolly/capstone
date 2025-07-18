"use client"

import { useState } from "react"
import { Briefcase, Users, Eye, TrendingUp, Award, BarChart, Plus, Edit, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { deleteJob } from "@/lib/slices/jobsSlice"
import { addNotification } from "@/lib/slices/notificationsSlice"
import { JobManagement } from "@/components/jobs/job-management"

export function CompanyDashboard() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { jobs, applications } = useAppSelector((state) => state.jobs)

  const [activeTab, setActiveTab] = useState("overview")
  const [showJobModal, setShowJobModal] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Filter jobs and applications for this company
  const companyJobs = jobs.filter((job) => job.company === user?.company || job.company === user?.name)
  const companyApplications = applications.filter((app) => companyJobs.some((job) => job.id === app.jobId))

  const companyStats = [
    {
      title: "Active Jobs",
      value: companyJobs.filter((job) => job.status === "active").length.toString(),
      change: "+3 this week",
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Applications",
      value: companyApplications.length.toString(),
      change: "+23 this week",
      icon: Users,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Profile Views",
      value: companyJobs.reduce((acc, job) => acc + (job.viewsCount || 0), 0).toString(),
      change: "+156 this month",
      icon: Eye,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Hire Rate",
      value: "23%",
      change: "+5% this month",
      icon: TrendingUp,
      color: "from-yellow-500 to-yellow-600",
    },
  ]

  const filteredApplications = companyApplications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewApplications = (jobId: string) => {
    router.push(`/company/jobs/${jobId}/applications`)
  }

  const handleEditJob = (jobId: string) => {
    setSelectedJobId(jobId)
    setShowJobModal(true)
  }

  const handleViewAnalytics = (jobId: string) => {
    router.push(`/company/jobs/${jobId}/analytics`)
  }

  const handlePostNewJob = () => {
    setSelectedJobId(undefined)
    setShowJobModal(true)
  }

  const handleViewCandidate = (candidateId: string) => {
    router.push(`/company/candidates/${candidateId}`)
  }

  const handleUpdateApplicationStatus = (applicationId: string, newStatus: string) => {
    // In a real app, this would update the application status
    dispatch(
      addNotification({
        title: "Application Updated",
        message: `Application status updated to ${newStatus}`,
        type: "success",
        read: false,
      }),
    )
  }

  const handleDeleteJob = (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      dispatch(deleteJob(jobId))
      dispatch(
        addNotification({
          title: "Job Deleted",
          message: "Job posting has been deleted successfully",
          type: "success",
          read: false,
        }),
      )
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-600"
      case "paused":
        return "bg-yellow-100 text-yellow-600"
      case "closed":
        return "bg-red-100 text-red-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-600"
      case "reviewed":
        return "bg-yellow-100 text-yellow-600"
      case "shortlisted":
        return "bg-green-100 text-green-600"
      case "rejected":
        return "bg-red-100 text-red-600"
      case "hired":
        return "bg-purple-100 text-purple-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Job Listings Performance */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold font-poppins text-gray-900">Job Listings Performance</h3>
                <button
                  onClick={handlePostNewJob}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Job
                </button>
              </div>
              <div className="space-y-4">
                {companyJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{job.applicationsCount || 0} applications</span>
                      <span>{job.viewsCount || 0} views</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewApplications(job.id)}
                        className="flex-1 px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        View Applications
                      </button>
                      <button
                        onClick={() => handleEditJob(job.id)}
                        className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewAnalytics(job.id)}
                        className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <BarChart className="w-3 h-3 mr-1" />
                        Analytics
                      </button>
                    </div>
                  </div>
                ))}

                {companyJobs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No job postings yet. Create your first job posting to get started.
                  </div>
                )}
              </div>
            </div>

            {/* Recent Applications */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold font-poppins text-gray-900">Recent Applications</h3>
                <button
                  onClick={() => router.push("/company/candidates")}
                  className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {companyApplications.slice(0, 3).map((application) => {
                  const job = companyJobs.find((j) => j.id === application.jobId)
                  return (
                    <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold">{application.candidateName.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{application.candidateName}</h4>
                          <p className="text-sm text-gray-600">{job?.title}</p>
                          <p className="text-xs text-gray-500">
                            Applied {new Date(application.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getApplicationStatusColor(application.status)}`}
                        >
                          {application.status}
                        </span>
                        <button
                          onClick={() => handleViewCandidate(application.id)}
                          className="px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  )
                })}

                {companyApplications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No applications received yet.</div>
                )}
              </div>
            </div>
          </div>
        )

      case "jobs":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold font-poppins text-gray-900">Job Management</h3>
              <button
                onClick={handlePostNewJob}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {companyJobs.map((job) => (
                <div key={job.id} className="glass-effect rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{job.title}</h4>
                      <p className="text-gray-600">
                        {job.salary} • Posted {new Date(job.postedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(job.status)}`}>{job.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{job.applicationsCount || 0}</p>
                      <p className="text-sm text-gray-600">Applications</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{job.viewsCount || 0}</p>
                      <p className="text-sm text-gray-600">Views</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">4.2</p>
                      <p className="text-sm text-gray-600">Match Score</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleViewApplications(job.id)}
                      className="flex-1 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      View Applications ({job.applicationsCount || 0})
                    </button>
                    <button
                      onClick={() => handleEditJob(job.id)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Edit Job
                    </button>
                    <button
                      onClick={() => handleViewAnalytics(job.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Analytics
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {companyJobs.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No job postings yet</h3>
                  <p className="text-gray-600 mb-6">Create your first job posting to start attracting candidates.</p>
                  <button
                    onClick={handlePostNewJob}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Post Your First Job
                  </button>
                </div>
              )}
            </div>
          </div>
        )

      case "candidates":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold font-poppins text-gray-900">Candidate Management</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredApplications.map((application) => {
                const job = companyJobs.find((j) => j.id === application.jobId)
                return (
                  <div key={application.id} className="glass-effect rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-lg">
                            {application.candidateName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{application.candidateName}</h4>
                          <p className="text-gray-600">{application.candidateEmail}</p>
                          <p className="text-sm text-gray-500">
                            Applied for: {job?.title} • {new Date(application.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${getApplicationStatusColor(application.status)}`}
                        >
                          {application.status}
                        </span>
                        <select
                          value={application.status}
                          onChange={(e) => handleUpdateApplicationStatus(application.id, e.target.value)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                          <option value="hired">Hired</option>
                        </select>
                        <button
                          onClick={() => handleViewCandidate(application.id)}
                          className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>

                    {application.coverLetter && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Cover Letter</h5>
                        <p className="text-sm text-gray-700 line-clamp-3">{application.coverLetter}</p>
                      </div>
                    )}
                  </div>
                )
              })}

              {filteredApplications.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
                  <p className="text-gray-600">No applications match your current filters.</p>
                </div>
              )}
            </div>
          </div>
        )

      case "analytics":
        return (
          <div className="space-y-6">
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-xl font-semibold font-poppins text-gray-900 mb-6">Hiring Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <BarChart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Time to Hire</h4>
                  <p className="text-2xl font-bold text-blue-600">18 days</p>
                  <p className="text-sm text-gray-600">average</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Quality of Hire</h4>
                  <p className="text-2xl font-bold text-green-600">4.3/5</p>
                  <p className="text-sm text-gray-600">manager rating</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Diversity Score</h4>
                  <p className="text-2xl font-bold text-purple-600">87%</p>
                  <p className="text-sm text-gray-600">diverse hires</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glass-effect rounded-xl p-6">
        <h1 className="text-2xl font-bold font-poppins gradient-text mb-2">
          Welcome back, {user?.name || user?.company}! 🏢
        </h1>
        <p className="text-gray-600">Ready to find amazing talent for your team?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {companyStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="glass-effect rounded-xl p-6 hover-lift transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="glass-effect rounded-xl p-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "jobs", label: "Job Management" },
              { id: "candidates", label: "Candidates" },
              { id: "analytics", label: "Analytics" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {renderTabContent()}
      </div>

      {/* Job Management Modal */}
      {showJobModal && (
        <JobManagement
          jobId={selectedJobId}
          onClose={() => {
            setShowJobModal(false)
            setSelectedJobId(undefined)
          }}
        />
      )}
    </div>
  )
}
