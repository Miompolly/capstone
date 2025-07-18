"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Calendar, Clock, AlertCircle, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AnalyticsData {
  overview: {
    total_bookings: number;
    pending_bookings: number;
    approved_bookings: number;
    denied_bookings: number;
    approval_rate: number;
    recent_bookings_30_days: number;
    avg_response_time_hours: number | null;
  };
  status_distribution: {
    pending: number;
    approved: number;
    denied: number;
  };
  monthly_trends: Array<{
    month: string;
    total: number;
    approved: number;
    denied: number;
    pending: number;
  }>;
  top_mentees: Array<{
    mentee__name: string;
    mentee__email: string;
    booking_count: number;
  }>;
  generated_at: string;
}

export function BookingAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
      const response = await fetch(`${baseUrl}/api/auth/bookings/analytics/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        setError("Failed to fetch analytics data");
      }
    } catch (error) {
      setError("Failed to fetch analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to load analytics
        </h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  const { overview, status_distribution, monthly_trends, top_mentees } =
    analyticsData;

  // Prepare data for charts
  const pieData = [
    { name: "Approved", value: status_distribution.approved, color: "#10B981" },
    { name: "Pending", value: status_distribution.pending, color: "#F59E0B" },
    { name: "Denied", value: status_distribution.denied, color: "#EF4444" },
  ];

  const monthlyData = monthly_trends.map((item) => ({
    month: new Date(item.month).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
    total: item.total,
    approved: item.approved,
    denied: item.denied,
    pending: item.pending,
  }));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.total_bookings}</div>
            <p className="text-xs text-muted-foreground">
              {overview.recent_bookings_30_days} in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.approval_rate}%</div>
            <p className="text-xs text-muted-foreground">
              {overview.approved_bookings} approved, {overview.denied_bookings}{" "}
              denied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.pending_bookings}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting your response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.avg_response_time_hours
                ? `${overview.avg_response_time_hours}h`
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Time to approve/deny
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="approved"
                  stroke="#10B981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="denied"
                  stroke="#EF4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Mentees and Monthly Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Mentees */}
        <Card>
          <CardHeader>
            <CardTitle>Top Mentees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {top_mentees.length > 0 ? (
                top_mentees.map((mentee, index) => (
                  <div
                    key={mentee.mentee__email}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {mentee.mentee__name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {mentee.mentee__email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {mentee.booking_count}
                      </p>
                      <p className="text-xs text-gray-600">bookings</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center py-4">
                  No booking data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Booking Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="approved" stackId="a" fill="#10B981" />
                <Bar dataKey="pending" stackId="a" fill="#F59E0B" />
                <Bar dataKey="denied" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(analyticsData.generated_at).toLocaleString()}
      </div>
    </div>
  );
}
