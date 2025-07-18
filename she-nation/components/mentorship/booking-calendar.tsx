"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetMentorBookingsQuery } from "@/lib/api/bookingApi";
import { useAppSelector } from "@/lib/hooks";
import type { Booking } from "@/lib/types/api";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const {
    data: allBookings = [],
    isLoading,
    error,
  } = useGetMentorBookingsQuery();
  const { user } = useAppSelector((state) => state.auth);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Filter bookings based on user role and email
  const filteredBookings = allBookings.filter((booking) => {
    if (!user?.email) return false;

    console.log("Filtering booking:", {
      bookingId: booking.id,
      mentor: booking.mentor,
      mentee: booking.mentee,
      userEmail: user.email,
      userRole: user.role,
    });

    if (user.role === "Mentor") {
      // Show bookings where the user is the mentor
      const isUserMentor = booking.mentor === user.email;
      console.log(
        `Mentor check: ${booking.mentor} === ${user.email} = ${isUserMentor}`
      );
      return isUserMentor;
    } else if (user.role === "mentee") {
      // Show bookings where the user is the mentee
      const isUserMentee = booking.mentee === user.email;
      console.log(
        `Mentee check: ${booking.mentee} === ${user.email} = ${isUserMentee}`
      );
      return isUserMentee;
    }

    // For other roles (admin, etc.), show all bookings
    return true;
  });

  console.log("Filtered bookings:", {
    totalBookings: allBookings.length,
    filteredBookings: filteredBookings.length,
    userRole: user?.role,
    userEmail: user?.email,
    bookings: filteredBookings,
  });

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get bookings for a specific date using filtered bookings
  const getBookingsForDate = (date: number): Booking[] => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`;

    console.log(`Looking for bookings on ${dateString}`);

    const dayBookings = filteredBookings.filter((booking) => {
      const bookingDate = booking.day;
      console.log(`Comparing booking date ${bookingDate} with ${dateString}`);
      return bookingDate === dateString;
    });

    console.log(
      `Found ${dayBookings.length} filtered bookings for ${dateString}:`,
      dayBookings
    );
    return dayBookings;
  };

  const formatTime = (time: string | null) => {
    if (!time) return null;
    try {
      const [hours, minutes] = time.split(":");
      const hour = Number.parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  const getBookingTitle = (booking: Booking) => {
    return booking.title || "Session";
  };

  const getBookingStatus = (booking: Booking) => {
    if (booking.time && booking.title) return "confirmed";
    return "pending";
  };

  // Format date for display without timezone issues
  const formatDateForDisplay = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 border border-gray-100 bg-gray-50"
        ></div>
      );
    }

    // Days of the month
    for (let date = 1; date <= daysInMonth; date++) {
      const dayBookings = getBookingsForDate(date);
      const today = new Date();
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === date;

      days.push(
        <div
          key={date}
          className={`h-24 border border-gray-100 p-1 ${
            isToday ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-gray-50"
          }`}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-blue-600" : "text-gray-900"
            }`}
          >
            {date}
          </div>
          <div className="space-y-1">
            {dayBookings.slice(0, 2).map((booking) => {
              const status = getBookingStatus(booking);
              const title = getBookingTitle(booking);
              const time = formatTime(booking.time);

              return (
                <div
                  key={booking.id}
                  className={`text-xs p-1 rounded truncate cursor-pointer ${
                    status === "confirmed"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  }`}
                  title={`${title}${time ? ` at ${time}` : ""} - ${status}`}
                >
                  <div className="font-medium truncate">{title}</div>
                  {time && <div className="text-xs opacity-75">{time}</div>}
                </div>
              );
            })}
            {dayBookings.length > 2 && (
              <div className="text-xs text-gray-500 text-center bg-gray-100 rounded px-1">
                +{dayBookings.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Failed to load bookings</p>
            <p className="text-sm mt-2">Please try refreshing the page</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCalendarTitle = () => {
    if (user?.role === "Mentor") {
      return "My Mentor Schedule";
    } else if (user?.role === "mentee") {
      return "My Bookings";
    }
    return "All Bookings";
  };

  const getEmptyStateMessage = () => {
    if (user?.role === "Mentor") {
      return "No mentoring sessions scheduled yet";
    } else if (user?.role === "mentee") {
      return "No bookings found. Book a session with a mentor to get started";
    }
    return "No bookings found";
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              {getCalendarTitle()}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-lg font-semibold min-w-[140px] text-center">
                {MONTHS[month]} {year}
              </span>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {/* User Info and Filter Status */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Logged in as:</span> {user?.email}{" "}
                ({user?.role})
              </div>
              <div>
                <span className="font-medium">Showing:</span>{" "}
                {filteredBookings.length} of {allBookings.length} bookings
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
            {/* Day Headers */}
            {DAYS.map((day) => (
              <div
                key={day}
                className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700 border-b border-gray-200"
              >
                {day}
              </div>
            ))}
            {/* Calendar Days */}
            {renderCalendarDays()}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span>Pending</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            My Booking Details ({filteredBookings.length} appointments)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>{getEmptyStateMessage()}</p>
              <p className="text-sm mt-2">
                Your scheduled sessions will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const status = getBookingStatus(booking);
                const title = getBookingTitle(booking);
                const time = formatTime(booking.time);

                return (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {title}
                          </h3>
                          <Badge
                            variant={
                              status === "confirmed" ? "default" : "secondary"
                            }
                          >
                            {status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDateForDisplay(booking.day)}</span>
                          </div>
                          {time && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{time}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>
                            {user?.role === "mentor"
                              ? `Mentee: ${booking.mentee}`
                              : `Mentor: ${booking.mentor}`}
                          </span>
                        </div>

                        {booking.note && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-2">
                            {booking.note}
                          </p>
                        )}

                        {/* Debug info - can be removed in production */}
                        <div className="text-xs text-gray-400 bg-gray-100 p-2 rounded mt-2">
                          <strong>Debug:</strong> ID: {booking.id}, Date:{" "}
                          {booking.day}, Mentor: {booking.mentor}, Mentee:{" "}
                          {booking.mentee}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
