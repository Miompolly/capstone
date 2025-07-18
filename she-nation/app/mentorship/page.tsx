"use client";

import { useState } from "react";
import { Search, Filter, Users, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MentorGrid } from "@/components/mentorship/mentor-grid";
import { useGetAllMentorsQuery } from "@/lib/api/mentorsApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function MentorshipPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    expertise: [] as string[],
    priceRange: [0, 1000] as [number, number],
    rating: 0,
    location: "",
    availability: "",
  });

  const { data: mentors = [], isLoading, error } = useGetAllMentorsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <Users className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Failed to Load Mentors
              </h2>
              <p className="text-gray-600 mb-4">
                There was an error loading the mentor list.
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleExpertiseFilter = (expertise: string) => {
    setFilters((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter((e) => e !== expertise)
        : [...prev.expertise, expertise],
    }));
  };

  // Get unique expertise areas from mentors
  const allExpertise = Array.from(
    new Set(mentors.flatMap((mentor) => mentor.expertise))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Mentor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with experienced professionals who can guide you on your
            career journey
          </p>
        </div>


        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search & Filter</span>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search mentors by name, expertise, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="space-y-4 pt-4 border-t">
                {/* Expertise Filter */}
                {allExpertise.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expertise
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allExpertise.map((expertise) => (
                        <Badge
                          key={expertise}
                          variant={
                            filters.expertise.includes(expertise)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => handleExpertiseFilter(expertise)}
                        >
                          {expertise}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Input
                    type="text"
                    placeholder="Filter by location..."
                    value={filters.location}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      expertise: [],
                      priceRange: [0, 1000],
                      rating: 0,
                      location: "",
                      availability: "",
                    })
                  }
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mentor Grid */}
        <MentorGrid
          mentors={mentors}
          searchQuery={searchQuery}
          filters={filters}
        />
      </div>
    </div>
  );
}
