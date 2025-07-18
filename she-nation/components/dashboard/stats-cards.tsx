"use client"

import { TrendingUp, BookOpen, Users, Award } from "lucide-react"

const stats = [
  {
    title: "Courses Completed",
    value: "0",
    change: "+1 this month",
    icon: BookOpen,
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Mentorship Hours",
    value: "0",
    change: "+1 this week",
    icon: Users,
    color: "from-pink-500 to-pink-600",
  },
  {
    title: "Skill Level",
    value: "0%",
    change: "0% this quarter",
    icon: TrendingUp,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Achievements",
    value: "1",
    change: "+1 this week",
    icon: Award,
    color: "from-teal-500 to-teal-600",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
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
  )
}
