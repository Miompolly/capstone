"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, FileText, Calendar, User } from "lucide-react";
import { useGetMyOpportunityApplicationsQuery } from "@/lib/api/opportunitiesApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDistanceToNow } from "date-fns";
import type { Application } from "@/lib/types/api";
import { useState } from "react";

export function JobApplicants() {
  const {
    data: response,
    isLoading,
    error,
  } = useGetMyOpportunityApplicationsQuery();

  const applications = response?.applications ?? [];

  const [processingIds, setProcessingIds] = useState<number[]>([]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600">Failed to load applications</p>
        </CardContent>
      </Card>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job Applications</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No applications received yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Applications for your posted jobs will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Group applications by opportunity
  const applicationsByOpportunity = applications.reduce((acc, app) => {
    const opportunityId = app.opportunity;
    if (!acc[opportunityId]) {
      acc[opportunityId] = [];
    }
    acc[opportunityId].push(app);
    return acc;
  }, {} as Record<number, Application[]>);

  // Example handlers to approve or deny applications
  const handleApprove = async (applicationId: number) => {
    setProcessingIds((ids) => [...ids, applicationId]);
    try {
      // Call your API to approve the application
      // await api.approveApplication(applicationId);
      alert(`Approved application ${applicationId}`);
      // Optionally refresh data here
    } catch (err) {
      console.error(err);
      alert("Failed to approve application");
    } finally {
      setProcessingIds((ids) => ids.filter((id) => id !== applicationId));
    }
  };

  const handleDeny = async (applicationId: number) => {
    setProcessingIds((ids) => [...ids, applicationId]);
    try {
      // Call your API to deny the application
      // await api.denyApplication(applicationId);
      alert(`Denied application ${applicationId}`);
      // Optionally refresh data here
    } catch (err) {
      console.error(err);
      alert("Failed to deny application");
    } finally {
      setProcessingIds((ids) => ids.filter((id) => id !== applicationId));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Job Applications ({applications.length})
          </CardTitle>
        </CardHeader>
      </Card>

      {Object.entries(applicationsByOpportunity).map(
        ([opportunityId, apps]) => (
          <Card key={opportunityId}>
            <CardHeader>
              <CardTitle className="text-lg">
                Applications for Opportunity #{opportunityId} ({apps.length}{" "}
                applicants)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apps.map((application) => (
                  <div
                    key={application.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {application.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {application.full_name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Applied{" "}
                            {formatDistanceToNow(
                              new Date(application.date_applied),
                              {
                                addSuffix: true,
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={getStatusColor(application.status)}
                        variant="secondary"
                      >
                        {getStatusText(application.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <a
                          href={`mailto:${application.email}`}
                          className="hover:text-purple-600"
                        >
                          {application.email}
                        </a>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <a
                          href={`tel:${application.phone}`}
                          className="hover:text-purple-600"
                        >
                          {application.phone}
                        </a>
                      </div>
                    </div>

                    {application.resume_url && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <FileText className="w-4 h-4 mr-2" />
                          <span>Resume attached</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(application.resume_url, "_blank")
                          }
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View Resume
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        Last updated:{" "}
                        {new Date(application.updated_at).toLocaleDateString()}
                      </div>

                      {/* Buttons for Approve / Deny */}
                      {application.status.toLowerCase() === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={processingIds.includes(application.id)}
                            onClick={() => handleApprove(application.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={processingIds.includes(application.id)}
                            onClick={() => handleDeny(application.id)}
                          >
                            Deny
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
