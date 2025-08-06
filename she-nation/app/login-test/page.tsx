"use client"

import { useState } from "react"
import { useLoginMutation } from "@/lib/api/authApi"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loginSuccess, loginFailure, loginStart } from "@/lib/slices/authSlice"
import toast from "react-hot-toast"

export default function LoginTestPage() {
  const [email, setEmail] = useState("mentee@test.com")
  const [password, setPassword] = useState("testpass123")
  const [login, { isLoading, error }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, token } = useAppSelector((state) => state.auth)

  const handleLogin = async () => {
    try {
      dispatch(loginStart())
      console.log("Attempting login with:", { email, password })
      
      const result = await login({ email, password }).unwrap()
      console.log("Login result:", result)

      dispatch(
        loginSuccess({
          user: result.user,
          access: result.access,
          refresh: result.refresh,
        })
      )

      toast.success("Login successful!")
    } catch (error: any) {
      console.error("Login error:", error)
      const errorMessage = error?.data?.detail || error?.data?.message || "Login failed"
      dispatch(loginFailure(errorMessage))
      toast.error(errorMessage)
    }
  }

  const handleDirectAPITest = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      console.log("Direct API response:", data)
      
      if (response.ok) {
        toast.success("Direct API call successful!")
      } else {
        toast.error("Direct API call failed: " + (data.detail || data.message))
      }
    } catch (error) {
      console.error("Direct API error:", error)
      toast.error("Direct API call failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Login Debug Page</h1>
        
        {/* Current Auth State */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Current Auth State</h2>
          <div className="space-y-2">
            <p><strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : "None"}</p>
            <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : "None"}</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Login Test</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {isLoading ? "Logging in..." : "Login with RTK Query"}
              </button>
              <button
                onClick={handleDirectAPITest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Test Direct API Call
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold">Error Details:</h3>
            <pre className="text-red-700 text-sm mt-2 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {/* API Configuration */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
          <div className="space-y-2">
            <p><strong>Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082"}/api</p>
            <p><strong>Login Endpoint:</strong> /auth/login/</p>
            <p><strong>Full URL:</strong> {(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082")}/api/auth/login/</p>
          </div>
        </div>

        {/* Network Test */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Network Test</h2>
          <button
            onClick={async () => {
              try {
                const response = await fetch("http://localhost:8082/api/auth/login/", {
                  method: "OPTIONS",
                })
                console.log("CORS preflight response:", response)
                toast.success("CORS preflight successful")
              } catch (error) {
                console.error("CORS preflight error:", error)
                toast.error("CORS preflight failed")
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Test CORS Preflight
          </button>
        </div>

        {/* Console Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-semibold">Debug Instructions:</h3>
          <p className="text-yellow-700 text-sm mt-2">
            Open browser developer tools (F12) and check the Console and Network tabs for detailed error information.
          </p>
        </div>
      </div>
    </div>
  )
}
