"use client";

import { useState } from "react";
import { useGetAllOpportunitiesQuery } from "@/lib/api/opportunitiesApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MapPin, Calendar, Clock, Building2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export function JobListings() {
  const {
    data: opportunities,
    isLoading,
    error,
  } = useGetAllOpportunitiesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load job opportunities</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Opportunity Available
        </h3>
        <p className="text-gray-600">Check back later for new opportunities!</p>
      </div>
    );
  }

  // Filter opportunities based on search and filters
  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesSearch =
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || opportunity.type === selectedType;
    const matchesLocation =
      !selectedLocation ||
      opportunity.location
        .toLowerCase()
        .includes(selectedLocation.toLowerCase());

    return (
      matchesSearch && matchesType && matchesLocation && opportunity.is_active
    );
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Full-time": "bg-green-100 text-green-800",
      "Part-time": "bg-blue-100 text-blue-800",
      Contract: "bg-purple-100 text-purple-800",
      Internship: "bg-orange-100 text-orange-800",
      Remote: "bg-indigo-100 text-indigo-800",
      Freelance: "bg-pink-100 text-pink-800",
      Temporary: "bg-yellow-100 text-yellow-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil(
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilDeadline <= 7;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search Opportunity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
         
          <input
            type="text"
            placeholder="Location..."
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredOpportunities.length} job
          {filteredOpportunities.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredOpportunities.map((opportunity) => (
          <Card
            key={opportunity.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                    {opportunity.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {opportunity.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Posted{" "}
                      {formatDistanceToNow(new Date(opportunity.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                 
                  {isDeadlineApproaching(opportunity.deadline) && (
                    <Badge variant="destructive" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      Deadline Soon
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4 line-clamp-3">
                {opportunity.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Apply by{" "}
                    {new Date(opportunity.deadline).toLocaleDateString()}
                  </div>
                </div>
                <Link href={`/jobs/${opportunity.id}`}>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Opportunity Match Your Criteria
          </h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
