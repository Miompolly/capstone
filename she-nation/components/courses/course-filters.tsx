"use client"

import { useState } from "react"
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import { useAppDispatch } from "@/lib/hooks"

interface CourseFiltersProps {
  onFilterChange?: (filters: any) => void
}

export function CourseFilters({ onFilterChange }: CourseFiltersProps) {
  const dispatch = useAppDispatch()
  const [expandedSections, setExpandedSections] = useState<string[]>(["Category", "Level"])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  const filterCategories = [
    {
      title: "Category",
      options: ["Leadership", "Technology", "Business", "Data Science", "Design", "Marketing"],
    },
    {
      title: "Level",
      options: ["Beginner", "Intermediate", "Advanced"],
    },
    {
      title: "Duration",
      options: ["1-4 weeks", "5-8 weeks", "9-12 weeks", "12+ weeks"],
    },
    {
      title: "Price",
      options: ["Free", "Under $100", "$100-$300", "$300+"],
    },
    {
      title: "Features",
      options: ["Certificates", "Live Sessions", "Projects", "Mentorship"],
    },
  ]

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const toggleFilter = (category: string, option: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category] || []
      const updated = current.includes(option) ? current.filter((o) => o !== option) : [...current, option]
      const newFilters = { ...prev, [category]: updated }

      // Call the callback if provided
      if (onFilterChange) {
        onFilterChange(newFilters)
      }

      return newFilters
    })
  }

  const clearAllFilters = () => {
    setSelectedFilters({})
    if (onFilterChange) {
      onFilterChange({})
    }
  }

  const activeFiltersCount = Object.values(selectedFilters).flat().length

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </h3>
        {activeFiltersCount > 0 && (
          <button onClick={clearAllFilters} className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
            <X className="w-4 h-4 mr-1" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-6">
        {filterCategories.map((category) => (
          <div key={category.title}>
            <button
              onClick={() => toggleSection(category.title)}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3 hover:text-purple-600 transition-colors"
            >
              {category.title}
              {expandedSections.includes(category.title) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {expandedSections.includes(category.title) && (
              <div className="space-y-2 pl-2">
                {category.options.map((option) => (
                  <label key={option} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={selectedFilters[category.title]?.includes(option) || false}
                      onChange={() => toggleFilter(category.title, option)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([category, options]) =>
              options.map((option) => (
                <span
                  key={`${category}-${option}`}
                  className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full"
                >
                  {option}
                  <button onClick={() => toggleFilter(category, option)} className="ml-1 hover:text-purple-800">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )),
            )}
          </div>
        </div>
      )}
    </div>
  )
}
