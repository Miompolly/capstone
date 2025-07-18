"use client"

import { useState } from "react"
import { User, Activity, Award, Settings } from "lucide-react"
import { ProfileOverview } from "./profile-overview"
import { ProfileActivity } from "./profile-activity"
import { ProfileAchievements } from "./profile-achievements"
import { ProfileSettings } from "./profile-settings"

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProfileOverview />
      case "activity":
        return <ProfileActivity />
      case "achievements":
        return <ProfileAchievements />
      case "settings":
        return <ProfileSettings />
      default:
        return <ProfileOverview />
    }
  }

  return (
    <div>
      {/* Tab Navigation */}
      <div className="glass-effect rounded-xl p-2 mb-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">{renderTabContent()}</div>
    </div>
  )
}
