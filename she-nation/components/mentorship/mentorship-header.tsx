"use client"

import type React from "react"

import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setSearchQuery, setFilters, clearFilters } from "@/lib/slices/mentorshipSlice"
import { Search, Filter, X } from "lucide-react"
import { useState } from "react"

export function MentorshipHeader() {
  const { searchQuery, filters } = useAppSelector((state) => state.mentorship)
  const dispatch = useAppDispatch()
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
  }

  const handleFilterChange = (filterType: string, value: any) => {
    dispatch(setFilters({ [filterType]: value }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
    setShowFilters(false)
  }

  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-poppins gradient-text mb-4">Find Your Perfect Mentor</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect with experienced professionals who can guide your career journey
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search mentors by name, expertise, or company..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="glass-effect rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filter Mentors</h3>
            <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
              <select
                onChange={(e) => handleFilterChange("expertise", e.target.value ? [e.target.value] : [])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Expertise</option>
                <option value="Product Management">Product Management</option>
                <option value="Leadership">Leadership</option>
                <option value="Engineering Management">Engineering Management</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                onChange={(e) => {
                  const range = e.target.value.split("-").map(Number)
                  handleFilterChange("priceRange", range.length === 2 ? range : [0, 500])
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="0-500">All Prices</option>
                <option value="0-100">$0 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200-500">$200+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select
                onChange={(e) => handleFilterChange("rating", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="0">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.8">4.8+ Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="Enter location"
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
