"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Save, UserPlus } from "lucide-react"
import { useAppDispatch } from "@/lib/hooks"
import { addNotification } from "@/lib/slices/notificationsSlice"

interface UserManagementProps {
  userId?: string
  onClose: () => void
}

export function UserManagement({ userId, onClose }: UserManagementProps) {
  const dispatch = useAppDispatch()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "mentee" as "mentee" | "mentor" | "lecturer" | "company" | "admin",
    status: "active" as "active" | "inactive" | "suspended",
    company: "",
    bio: "",
    expertise: "",
    location: "",
    phone: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load user data if editing
  useEffect(() => {
    if (userId) {
      // In a real app, this would fetch user data from the API
      // For now, we'll use mock data
      setFormData({
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        role: "mentee",
        status: "active",
        company: "",
        bio: "Passionate about learning and growing in tech",
        expertise: "JavaScript, React, Node.js",
        location: "San Francisco, CA",
        phone: "+1 (555) 123-4567",
      })
    }
  }, [userId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      // In a real app, this would make an API call
      dispatch(
        addNotification({
          title: userId ? "User Updated" : "User Created",
          message: `User "${formData.name}" has been ${userId ? "updated" : "created"} successfully`,
          type: "success",
          read: false,
        }),
      )

      onClose()
    } catch (error) {
      dispatch(
        addNotification({
          title: "Error",
          message: "Failed to save user",
          type: "error",
          read: false,
        }),
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-900">{userId ? "Edit User" : "Add New User"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role*</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="mentee">Mentee</option>
                <option value="mentor">Mentor</option>
                <option value="lecturer">Lecturer</option>
                <option value="company">Company</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status*</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Enter location"
              />
            </div>
          </div>

          {(formData.role === "company" || formData.role === "lecturer") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.role === "company" ? "Company Name" : "Institution"}
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder={formData.role === "company" ? "Enter company name" : "Enter institution name"}
              />
            </div>
          )}

          {(formData.role === "mentor" || formData.role === "lecturer") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
              <input
                type="text"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Enter areas of expertise (comma separated)"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter bio or description"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
            >
              {userId ? <Save className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
              {userId ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
