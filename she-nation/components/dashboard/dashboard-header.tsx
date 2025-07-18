"use client"

import { useAppSelector } from "@/lib/hooks"
import { Calendar, Clock } from "lucide-react"

export function DashboardHeader() {
  const { user } = useAppSelector((state) => state.auth)
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-poppins gradient-text">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {currentDate}
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="glass-effect rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium">
                {new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
