"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, DollarSign, Bookmark } from "lucide-react";
import Link from "next/link";

export function FeaturedJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:8082/api/applications/opportunities/"
        );
        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await res.json();
        setJobs(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-600">
        Loading featured jobs...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center py-10 text-red-600">
        Error fetching jobs: {error}
      </p>
    );
  }

  if (!jobs.length) {
    return (
      <p className="text-center py-10 text-gray-600">
        No featured jobs available.
      </p>
    );
  }

  // Format dates nicely
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-poppins">Featured Jobs</h2>
        <Link
          href="/jobs"
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="glass-effect rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative"
          >
            {/* Urgent badge if deadline less than 7 days away */}
            {new Date(job.deadline) <
              new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                  Urgent
                </span>
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <img
                src="/placeholder.svg"
                alt={job.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bookmark className="w-5 h-5 text-gray-400 hover:text-purple-600" />
              </button>
            </div>

            <h3 className="font-semibold text-gray-900 text-lg mb-2 hover:text-purple-600 cursor-pointer transition-colors">
              {job.title}
            </h3>

            <p className="text-purple-600 font-medium mb-4">{job.location}</p>

            <div className="space-y-2 mb-4 text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{job.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">{job.type}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">
                  {job.eligibility_criteria || "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">
                  Deadline: {formatDate(job.deadline)}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Link
                href={`/jobs/${job.id}`}
                className="flex-1 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-center"
              >
                View Details
              </Link>
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
