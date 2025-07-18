"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { addJob, updateJob, deleteJob } from "@/lib/slices/jobsSlice"
import { addNotification } from "@/lib/slices/notificationsSlice"
import { X, Save, Trash2, Plus } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface JobManagementProps {
  jobId?: string
  onClose: () => void
}

export function JobManagement({ jobId, onClose }: JobManagementProps) {
  const dispatch = useAppDispatch()
  const { jobs, loading } = useAppSelector((state) => state.jobs)
  const { user } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    title: "",
    company: user?.company || user?.name || "",
    location: "",
    type: "Full-time" as "Full-time" | "Part-time" | "Contract" | "Remote",
    category: "",
    salary: "",
    description: "",
    requirements: [""],
    benefits: [""],
    applicationDeadline: "",
    featured: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load job data if editing
  useEffect(() => {
    if (jobId) {
      const job = jobs.find((j) => j.id === jobId)
      if (job) {
        setFormData({
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          category: job.category,
          salary: job.salary,
          description: job.description,
          requirements: job.requirements || [""],
          benefits: job.benefits || [""],
          applicationDeadline: job.applicationDeadline,
          featured: job.featured,
        })
      }
    }
  }, [jobId, jobs])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Job title is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.category.trim()) newErrors.category = "Category is required"
    if (!formData.salary.trim()) newErrors.salary = "Salary range is required"
    if (!formData.description.trim()) newErrors.description = "Job description is required"
    if (!formData.applicationDeadline) newErrors.applicationDeadline = "Application deadline is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleArrayChange = (field: "requirements" | "benefits", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayItem = (field: "requirements" | "benefits") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayItem = (field: "requirements" | "benefits", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.filter((req) => req.trim()),
        benefits: formData.benefits.filter((benefit) => benefit.trim()),
        postedDate: jobId
          ? jobs.find((j) => j.id === jobId)?.postedDate || new Date().toISOString()
          : new Date().toISOString(),
        logo: "/placeholder.svg?height=60&width=60",
      }

      if (jobId) {
        dispatch(updateJob({ id: jobId, updates: jobData }))
        dispatch(
          addNotification({
            title: "Job Updated",
            message: `"${formData.title}" has been updated successfully`,
            type: "success",
            read: false,
          }),
        )
      } else {
        dispatch(addJob(jobData))
        dispatch(
          addNotification({
            title: "Job Posted",
            message: `"${formData.title}" has been posted successfully`,
            type: "success",
            read: false,
          }),
        )
      }

      onClose()
    } catch (error) {
      dispatch(
        addNotification({
          title: "Error",
          message: "Failed to save job posting",
          type: "error",
          read: false,
        }),
      )
    }
  }

  const handleDelete = () => {
    if (!jobId) return

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
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-900">
            {jobId ? "Edit Job Posting" : "Create New Job Posting"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. Senior Software Engineer"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-gray-50"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location*</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                  errors.location ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. San Francisco, CA"
              />
              {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. Engineering, Marketing, Sales"
              />
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range*</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                  errors.salary ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. $80,000 - $120,000"
              />
              {errors.salary && <p className="mt-1 text-sm text-red-500">{errors.salary}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter a requirement"
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("requirements", index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("requirements")}
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Requirement
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleArrayChange("benefits", index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter a benefit"
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("benefits", index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("benefits")}
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Benefit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline*</label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                  errors.applicationDeadline ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.applicationDeadline && <p className="mt-1 text-sm text-red-500">{errors.applicationDeadline}</p>}
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Job Posting</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            {jobId && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Job
              </button>
            )}

            <div className="flex space-x-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
              >
                {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {jobId ? "Update Job" : "Post Job"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
