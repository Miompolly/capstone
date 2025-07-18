"use client"

import { Users, BookOpen, Briefcase, MessageCircle, Award, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Expert Mentorship",
    description: "Connect with industry leaders and experienced professionals who will guide your journey.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: BookOpen,
    title: "Skills Training",
    description: "Access cutting-edge courses designed to build in-demand skills for the modern workplace.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: Briefcase,
    title: "Career Opportunities",
    description: "Discover exclusive job openings and business opportunities tailored to your goals.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: MessageCircle,
    title: "Community Forum",
    description: "Engage with like-minded women, share experiences, and build lasting professional relationships.",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: Award,
    title: "Certifications",
    description: "Earn recognized certifications that validate your skills and boost your professional credibility.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your growth with detailed analytics and personalized insights on your journey.",
    color: "from-emerald-500 to-emerald-600",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-poppins gradient-text mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and resources you need to accelerate your career and
            achieve your goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 hover-lift hover:bg-white/90 transition-all duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold font-poppins text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
