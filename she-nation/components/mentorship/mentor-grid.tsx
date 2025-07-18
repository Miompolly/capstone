"use client";

import { useState } from "react";
import {
  Clock,
  DollarSign,
  Calendar,
  MapPin,
  MessageCircle,
  User,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MentorBookingModal } from "./mentor-booking-modal";
import type { Mentor } from "@/lib/types/api";

interface MentorGridProps {
  mentors: Mentor[];
  searchQuery?: string;
  filters?: {
    expertise: string[];
    priceRange: [number, number];
    rating: number;
    location: string;
    availability: string;
  };
}

export function MentorGrid({
  mentors,
  searchQuery = "",
  filters,
}: MentorGridProps) {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Filter mentors based on search and filters
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      !searchQuery ||
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((exp) =>
        exp.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (filters) {
      const matchesExpertise =
        !filters.expertise.length ||
        filters.expertise.some((exp) =>
          mentor.expertise.some((skill) =>
            skill.toLowerCase().includes(exp.toLowerCase())
          )
        );

      const mentorPrice = Number.parseFloat(mentor.price) || 0;
      const matchesPrice =
        mentorPrice >= filters.priceRange[0] &&
        mentorPrice <= filters.priceRange[1];

      const matchesLocation =
        !filters.location ||
        mentor.location.toLowerCase().includes(filters.location.toLowerCase());

      const matchesAvailability =
        !filters.availability ||
        mentor.availability.some((slot) =>
          slot.toLowerCase().includes(filters.availability.toLowerCase())
        );

      return (
        matchesExpertise &&
        matchesPrice &&
        matchesLocation &&
        matchesAvailability
      );
    }

    return true;
  });

  const handleBookSession = (mentor: Mentor) => {
    console.log("Booking session with mentor:", mentor);
    setSelectedMentor(mentor);
    setIsBookingModalOpen(true);
  };

  const handleViewProfile = (mentorId: number) => {
    // Navigate to mentor profile page
    window.location.href = `/mentors/${mentorId}`;
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedMentor(null);
  };

  if (filteredMentors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No mentors found
        </h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your search criteria or filters to find more mentors.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredMentors.length} mentor
          {filteredMentors.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <Card
            key={mentor.id}
            className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
          >
            <CardContent className="p-6">
              {/* Mentor Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="relative">
                  {mentor.avatar && mentor.avatar !== "/placeholder.svg" ? (
                    <img
                      src={mentor.avatar || "/placeholder.svg"}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {mentor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg truncate">
                    {mentor.name}
                  </h3>
                  <p className="text-gray-600 text-sm truncate">
                    {mentor.title}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {mentor.email}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span>{mentor.sessions} sessions</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="truncate">{mentor.location}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <Phone className="w-4 h-4" />
                <span>{mentor.phone}</span>
              </div>

              {/* Education Level */}
              <div className="mb-4 fle items-center"> Ed. Level: 
                <Badge variant="secondary" className="text-xs capitalize">
                  {mentor.education_level}
                </Badge>
              </div>

              {/* Expertise */}
              {mentor.expertise.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">
                    Expertise
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.expertise.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Experience */}
              {mentor.experience && mentor.experience !== "N/A" && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700">{mentor.experience}</p>
                </div>
              )}

              {/* Price and Availability */}
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="font-medium">${mentor.price}/hour</span>
                </div>
               
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
               
                <Button
                  onClick={() => handleBookSession(mentor)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm"
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Book Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedMentor && (
        <MentorBookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          mentor={selectedMentor}
        />
      )}
    </>
  );
}
