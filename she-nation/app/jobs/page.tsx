import type { Metadata } from "next";
import { JobsHeader } from "@/components/jobs/jobs-header";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobListings } from "@/components/jobs/job-listings";
import { FeaturedJobs } from "@/components/jobs/featured-jobs";

export const metadata: Metadata = {
  title: "Jobs - SheNation",
  description: "Discover career opportunities and job openings in tech",
};

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <JobsHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">
          <JobListings />
      </div>
    </div>
  );
}
