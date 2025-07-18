"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle } from "lucide-react";
import type { Opportunity } from "@/lib/types/api";

interface JobDetailsContentProps {
  opportunity: Opportunity;
}

export function JobDetailsContent({ opportunity }: JobDetailsContentProps) {
  return (
    <div className="space-y-6">
      {/* Job Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Job Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {opportunity.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Eligibility Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Eligibility Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {opportunity.eligibility_criteria}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Job Type</h4>
              <p className="text-gray-700">{opportunity.type}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
              <p className="text-gray-700">{opportunity.location}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Posted Date</h4>
              <p className="text-gray-700">
                {new Date(opportunity.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Application Deadline
              </h4>
              <p className="text-gray-700">
                {new Date(opportunity.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
