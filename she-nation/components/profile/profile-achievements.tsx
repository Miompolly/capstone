"use client";

import { Award, Trophy, Target } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useGetMentorBookingsQuery } from "@/lib/api/bookingApi";

export function ProfileAchievements() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: bookings = [] } = useGetMentorBookingsQuery();

  // Calculate real achievements based on actual data
  const completedBookings = bookings.filter((b) => b.time && b.title).length;
  const totalBookings = bookings.length;

  const realAchievements = [];

  // Add achievements based on real data
  if (completedBookings >= 5) {
    realAchievements.push({
      id: 1,
      title: "Active Participant",
      description: `Completed ${completedBookings} mentoring sessions`,
      icon: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-100",
      earned: true,
      date: new Date().toISOString(),
    });
  }

  if (totalBookings >= 10) {
    realAchievements.push({
      id: 2,
      title: "Dedicated Learner",
      description: `Made ${totalBookings} booking requests`,
      icon: Award,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      earned: true,
      date: new Date().toISOString(),
    });
  }

  if (user?.role === "mentor" && bookings.length > 0) {
    realAchievements.push({
      id: 3,
      title: "Mentor",
      description: "Actively mentoring other members",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      earned: true,
      date: new Date().toISOString(),
    });
  }

  const achievements = [
    {
      id: 4,
      title: "Skill Specialist",
      description: "Master 15 different skills",
      icon: Target,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      earned: false,
      progress: 80,
    },
    {
      id: 5,
      title: "Network Builder",
      description: "Connect with 100+ professionals",
      icon: Award,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      earned: false,
      progress: 65,
    },
    {
      id: 6,
      title: "Knowledge Sharer",
      description: "Create and share 5+ resources",
      icon: Award,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      earned: false,
      progress: 40,
    },
  ];

  const earnedAchievements = [
    ...realAchievements,
    ...achievements.filter((a) => a.earned),
  ];
  const inProgressAchievements = achievements.filter((a) => !a.earned);

  return (
    <div className="space-y-6">
      {realAchievements.length > 0 ? (
        <>
          {/* Achievement Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-effect rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {earnedAchievements.length}
              </div>
              <div className="text-gray-600">Achievements Earned</div>
            </div>
            <div className="glass-effect rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {completedBookings}
              </div>
              <div className="text-gray-600">Sessions Completed</div>
            </div>
            <div className="glass-effect rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {totalBookings}
              </div>
              <div className="text-gray-600">Total Bookings</div>
            </div>
          </div>

          {/* Earned Achievements */}
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-600" />
              Your Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${achievement.bgColor}`}>
                        <Icon className={`w-6 h-6 ${achievement.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {achievement.date
                            ? new Date(achievement.date).toLocaleDateString()
                            : "Earned recently"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* In Progress Achievements */}
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-600" />
              In Progress
            </h3>
            <div className="space-y-4">
              {inProgressAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-lg ${achievement.bgColor} opacity-60`}
                      >
                        <Icon className={`w-6 h-6 ${achievement.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {achievement.title}
                          </h4>
                          <span className="text-sm font-medium text-purple-600">
                            {achievement.progress}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {achievement.description}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-600" />
            Achievements
          </h3>
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No achievements yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Complete activities to earn your first achievement!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
