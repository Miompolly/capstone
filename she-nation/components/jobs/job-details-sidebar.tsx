"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApplyToOpportunityMutation } from "@/lib/api/opportunitiesApi";
import { useAppSelector } from "@/lib/hooks";
import { JobApplicationModal } from "./job-application-modal";
import { MapPin, Calendar, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { Opportunity } from "@/lib/types/api";

interface JobDetailsSidebarProps {
  opportunity: Opportunity;
}

export function JobDetailsSidebar({ opportunity }: JobDetailsSidebarProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applyToOpportunity, { isLoading: isApplying }] =
    useApplyToOpportunityMutation();

  const isDeadlinePassed = new Date(opportunity.deadline) < new Date();
  const canApply =
    opportunity.is_active && !isDeadlinePassed && user?.role === "mentee";

  const handleApplicationSubmit = async (applicationData: any) => {
    try {
      await applyToOpportunity({
        opportunityId: opportunity.id,
        payload: applicationData,
      }).unwrap();

      toast.success("Application submitted successfully!");
      setShowApplicationModal(false);
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(
        error?.data?.detail || "Failed to submit application. Please try again."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Apply Card */}
      <Card>
        <CardHeader>
          <CardTitle>Apply for this Position</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800">
                  Please log in to apply for this position
                </p>
              </div>
            </div>
          )}

          {user?.role !== "mentee" && user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  Only mentees can apply for job opportunities
                </p>
              </div>
            </div>
          )}

          {isDeadlinePassed && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-sm text-red-800">
                  Application deadline has passed
                </p>
              </div>
            </div>
          )}

          {!opportunity.is_active && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-gray-600 mr-2" />
                <p className="text-sm text-gray-800">
                  This job posting is no longer active
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={() => setShowApplicationModal(true)}
            disabled={!canApply || isApplying}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {canApply ? "Apply Now" : "Cannot Apply"}
          </Button>
        </CardContent>
      </Card>

      {/* Job Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Job Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Job Type</span>
            <Badge variant="secondary">{opportunity.type}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Location</span>
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {opportunity.location}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Posted</span>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(opportunity.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Deadline</span>
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(opportunity.deadline).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Status</span>
            <Badge variant={opportunity.is_active ? "default" : "secondary"}>
              {opportunity.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Application Modal */}
      {showApplicationModal && (
        <JobApplicationModal
          opportunity={opportunity}
          onClose={() => setShowApplicationModal(false)}
          onSubmit={handleApplicationSubmit}
          isLoading={isApplying}
        />
      )}
    </div>
  );
}
