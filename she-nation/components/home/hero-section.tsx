"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Play, Sparkles } from "lucide-react"

export function HeroSection() {
  const [currentText, setCurrentText] = useState(0)
  const texts = ["Leaders", "Innovators", "Entrepreneurs", "Changemakers"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
      <div
        className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
        style={{ animationDelay: "4s" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 mb-8">
            <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Empowering 18+ to 30 years old from Burundi
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold font-poppins mb-6">
            <span className="block text-gray-900">Empowering Youth</span>
            <span className="block gradient-text">From Burundi</span>
            <span className="block text-gray-900 min-h-[1.2em]">
              {texts[currentText]}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join a vibrant community of motivated young adults. Gain access to
            mentorship, skills training, and career opportunities tailored for
            Burundi’s youth aged 18 to 30.
          </p>

          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/dashboard"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group inline-flex items-center px-8 py-4 bg-white/50 backdrop-blur-sm border border-white/50 text-gray-700 font-semibold rounded-full hover:bg-white/70 transition-all duration-300">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
