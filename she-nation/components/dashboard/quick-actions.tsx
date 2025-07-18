"use client"

import { Plus, Search, MessageCircle, Calendar } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Find a Mentor",
    description: "Connect with industry experts",
    icon: Search,
    href: "/mentorship",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Browse Courses",
    description: "Discover new skills",
    icon: Plus,
    href: "/courses",
    color: "from-pink-500 to-pink-600",
  },
  {
    title: "Join Discussion",
    description: "Engage with community",
    icon: MessageCircle,
    href: "/forum",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Schedule Session",
    description: "Book mentorship time",
    icon: Calendar,
    href: "/mentorship",
    color: "from-teal-500 to-teal-600",
  },
]

export function QuickActions() {
  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-xl font-semibold font-poppins text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group p-4 rounded-lg bg-white/50 border border-white/30 hover:bg-white/70 hover-lift transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm mb-1">{action.title}</h4>
              <p className="text-xs text-gray-600">{action.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
