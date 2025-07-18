"use client";

import { useParams } from "next/navigation";
import { JobDetailsHeader } from "@/components/jobs/job-details-header";
import { JobDetailsContent } from "@/components/jobs/job-details-content";
import { JobDetailsSidebar } from "@/components/jobs/job-details-sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useGetOpportunityByIdQuery } from "@/lib/api/opportunitiesApi";
import { Card, CardContent } from "@/components/ui/card";

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = Number.parseInt(params.id as string);

  const {
    data: opportunity,
    isLoading,
    error,
  } = useGetOpportunityByIdQuery(jobId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Job Not Found
              </h1>
              <p className="text-gray-600">
                The job opportunity you're looking for doesn't exist or has been
                removed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <JobDetailsHeader opportunity={opportunity} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <JobDetailsContent opportunity={opportunity} />
          </div>

          <div className="lg:col-span-1">
            <JobDetailsSidebar opportunity={opportunity} />
          </div>
        </div>
      </div>
    </div>
  );
}
