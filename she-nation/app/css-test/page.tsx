"use client"

export default function CSSTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">CSS Test Page</h1>
        
        {/* Test Basic Tailwind Classes */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Tailwind Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-500 text-white p-4 rounded-lg">Blue Box</div>
            <div className="bg-green-500 text-white p-4 rounded-lg">Green Box</div>
            <div className="bg-purple-500 text-white p-4 rounded-lg">Purple Box</div>
          </div>
        </div>

        {/* Test Gradient Classes */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Gradient Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              Blue Gradient
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              Purple Gradient
            </div>
          </div>
        </div>

        {/* Test Custom Classes */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Custom Classes Test</h2>
          <div className="space-y-4">
            <div className="glass-effect p-4 rounded-lg">
              Glass Effect Test
            </div>
            <div className="dashboard-card">
              Dashboard Card Test
            </div>
            <div className="bg-white p-4 rounded-lg hover-lift">
              Hover Lift Test (hover me)
            </div>
          </div>
        </div>

        {/* Test Dashboard-like Layout */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Layout Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Stat 1", value: "123", color: "from-blue-500 to-blue-600" },
              { title: "Stat 2", value: "456", color: "from-green-500 to-green-600" },
              { title: "Stat 3", value: "789", color: "from-purple-500 to-purple-600" },
              { title: "Stat 4", value: "101", color: "from-yellow-500 to-yellow-600" },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <div className="w-6 h-6 bg-white rounded"></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-green-600">+5% this week</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Responsive Grid */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsive Grid Test</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Left Column</h3>
              <p className="text-gray-600">This should be full width on mobile and half width on large screens.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Right Column</h3>
              <p className="text-gray-600">This should be full width on mobile and half width on large screens.</p>
            </div>
          </div>
        </div>

        {/* Test Typography */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Typography Test</h2>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Heading 1</h1>
            <h2 className="text-2xl font-semibold text-gray-900">Heading 2</h2>
            <h3 className="text-xl font-semibold text-gray-900">Heading 3</h3>
            <p className="text-base text-gray-700">Regular paragraph text</p>
            <p className="text-sm text-gray-600">Small text</p>
            <p className="text-xs text-gray-500">Extra small text</p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Button Test</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Secondary Button
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Success Button
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Danger Button
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
