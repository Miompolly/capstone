"use client"

import { useState } from "react"

export default function SimpleLoginPage() {
  const [email, setEmail] = useState("mentee@test.com")
  const [password, setPassword] = useState("testpass123")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log("Making login request...")
      
      const response = await fetch("http://localhost:8082/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      const data = await response.json()
      console.log("Response data:", data)

      if (response.ok) {
        setResult(data)
        console.log("Login successful!")
      } else {
        setError(data)
        console.log("Login failed:", data)
      }
    } catch (err) {
      console.error("Network error:", err)
      setError({ message: "Network error", details: err })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Simple Login Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800">Success!</h3>
            <pre className="text-sm text-green-700 mt-2 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800">Error!</h3>
            <pre className="text-sm text-red-700 mt-2 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800">Instructions:</h3>
          <p className="text-sm text-gray-600 mt-1">
            Open browser developer tools (F12) and check the Console tab for detailed logs.
          </p>
        </div>
      </div>
    </div>
  )
}
