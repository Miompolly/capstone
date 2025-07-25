"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Video,
  MapPin,
  Plus,
  Filter,
  Download,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetMentorBookingsQuery,
  useGetMenteeBookingsQuery,
} from "@/lib/api/bookingApi";
import { useAppSelector } from "@/lib/hooks";
import type { Booking } from "@/lib/types/api";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO,
} from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

interface CalendarEvent extends Booking {
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  meetingLink?: string;
}

// Utility function to create a new Google Meet room
const createGoogleMeetRoom = (): string => {
  // This opens Google Meet's "new meeting" page where users can create a real meeting room
  return "https://meet.google.com/new";
};

// Utility function to generate a meeting room instruction
const generateMeetingInstructions = (booking: Booking): string => {
  return (
    `To join this session:\n\n` +
    `1. Click "Create Meeting Room" to start a new Google Meet\n` +
    `2. Copy the meeting link from Google Meet\n` +
    `3. Share the link with ${booking.mentor} via email or message\n\n` +
    `Alternative: Use the "Add to Calendar" button to create a calendar event with automatic Google Meet integration.`
  );
};

// Utility function to generate meeting options for a booking
const generateMeetingOptions = (booking: Booking) => {
  return {
    newGoogleMeet: "https://meet.google.com/new",
    googleCalendarWithMeet: generateGoogleCalendarWithMeetLink(booking),
    zoom: "https://zoom.us/start/videomeeting",
    teams: "https://teams.microsoft.com/start",
  };
};

// Utility function to create Google Calendar event with Meet integration
const generateGoogleCalendarWithMeetLink = (booking: Booking): string => {
  const startTime = booking.time
    ? new Date(`${booking.day}T${booking.time}`)
    : new Date(booking.day);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

  const startTimeFormatted =
    startTime.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const endTimeFormatted =
    endTime.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const title = encodeURIComponent(booking.title || "Mentorship Session");
  const description = encodeURIComponent(
    `Mentorship session between ${booking.mentor} and ${booking.mentee}.\n\n` +
      `Note: ${booking.note || "No additional notes"}\n\n` +
      `This event will automatically create a Google Meet room when added to your calendar.`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTimeFormatted}/${endTimeFormatted}&details=${description}&location=Google%20Meet&conferenceData.createRequest=requestId`;
};

// Utility function to create Google Calendar event URL
const generateGoogleCalendarLink = (event: CalendarEvent): string => {
  const startTime =
    event.startTime.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const endTime =
    event.endTime.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const title = encodeURIComponent(event.title || "Mentorship Session");
  const description = encodeURIComponent(
    `Mentorship session between ${event.mentor} and ${event.mentee}.\n\n` +
      `Join the meeting: ${event.meetingLink}\n\n` +
      `Note: ${event.note || "No additional notes"}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${description}&location=Online%20Meeting`;
};

export function EnhancedBookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { user } = useAppSelector((state) => state.auth);

  // Fetch bookings based on user role
  const { data: mentorBookings = [], isLoading: mentorLoading } =
    useGetMentorBookingsQuery(undefined, {
      skip:
        user?.role !== "mentor" &&
        user?.role !== "Mentor" &&
        user?.role !== "admin",
    });

  const { data: menteeBookings = [], isLoading: menteeLoading } =
    useGetMenteeBookingsQuery(undefined, {
      skip:
        user?.role === "mentor" ||
        user?.role === "Mentor" ||
        user?.role === "admin",
    });

  const allBookings =
    user?.role === "mentor" || user?.role === "Mentor" || user?.role === "admin"
      ? mentorBookings
      : menteeBookings;
  const isLoading =
    user?.role === "mentor" || user?.role === "Mentor" || user?.role === "admin"
      ? mentorLoading
      : menteeLoading;

  // Convert bookings to calendar events
  const calendarEvents = useMemo(() => {
    return allBookings
      .filter((booking) => {
        if (statusFilter === "all") return true;
        return booking.status === statusFilter;
      })
      .map((booking): CalendarEvent => {
        const bookingDate = parseISO(booking.day);
        const startTime = booking.time
          ? new Date(`${booking.day}T${booking.time}`)
          : bookingDate;
        const endTime = booking.time
          ? new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour default
          : bookingDate;

        return {
          ...booking,
          startTime,
          endTime,
          isAllDay: !booking.time,
          meetingLink:
            booking.status === "approved" && booking.google_meet_link
              ? booking.google_meet_link
              : undefined,
        };
      });
  }, [allBookings, statusFilter]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === "next" ? 7 : -7));
      return newDate;
    });
  };

  const navigateDay = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter((event) => isSameDay(event.startTime, date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "denied":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const exportToCalendar = () => {
    const approvedEvents = calendarEvents.filter(
      (event) => event.status === "approved"
    );

    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//SheNation//Booking Calendar//EN",
      "CALSCALE:GREGORIAN",
    ];

    approvedEvents.forEach((event) => {
      const startDate = format(event.startTime, "yyyyMMdd'T'HHmmss");
      const endDate = format(event.endTime, "yyyyMMdd'T'HHmmss");

      icsContent.push(
        "BEGIN:VEVENT",
        `UID:booking-${event.id}@shenation.com`,
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${event.title || "Mentorship Session"}`,
        `DESCRIPTION:Session with ${
          user?.role === "mentor" ? event.mentee : event.mentor
        }${event.note ? `\\n\\nNote: ${event.note}` : ""}${
          event.meetingLink ? `\\n\\nJoin Meeting: ${event.meetingLink}` : ""
        }`,
        `LOCATION:${event.meetingLink || "Online Meeting"}`,
        `URL:${event.meetingLink || ""}`,
        "STATUS:CONFIRMED",
        "END:VEVENT"
      );
    });

    icsContent.push("END:VCALENDAR");

    const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shenation-bookings.ics";
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderMonthView = () => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const calendarDays = [];

    // Previous month's trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      calendarDays.push(
        <div
          key={`prev-${date.getDate()}`}
          className="p-2 text-gray-400 bg-gray-50"
        >
          <div className="text-sm">{date.getDate()}</div>
        </div>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const events = getEventsForDate(date);
      const isToday = isSameDay(date, new Date());

      calendarDays.push(
        <div
          key={day}
          className={`p-2 min-h-[100px] border border-gray-200 ${
            isToday ? "bg-blue-50 border-blue-300" : "bg-white"
          }`}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-blue-600" : "text-gray-900"
            }`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {events.slice(0, 3).map((event) => (
              <TooltipProvider key={event.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`text-xs p-1 rounded border ${getStatusColor(
                        event.status
                      )} cursor-pointer hover:shadow-sm transition-shadow`}
                    >
                      <div className="font-medium truncate flex items-center gap-1">
                        {event.title || "Mentorship Session"}
                        {event.meetingLink && (
                          <Video className="w-3 h-3 text-blue-600" />
                        )}
                      </div>
                      {event.time && (
                        <div className="text-xs opacity-75">{event.time}</div>
                      )}
                      {event.meetingLink && (
                        <div className="flex items-center gap-1 mt-1">
                          {event.google_meet_link ? (
                            // Show direct join button if auto-generated link exists
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(event.google_meet_link, "_blank");
                              }}
                              className="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                            >
                              <Video className="w-2 h-2" />
                              Join Meeting
                            </button>
                          ) : (
                            // Show dropdown for manual meeting creation
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                                >
                                  <Video className="w-2 h-2" />
                                  Start Meeting
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="start"
                                className="w-48"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    window.open(
                                      "https://meet.google.com/new",
                                      "_blank"
                                    )
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Video className="w-4 h-4 text-blue-600" />
                                  <div>
                                    <div className="font-medium">
                                      Google Meet
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Create new room
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    window.open(
                                      generateGoogleCalendarWithMeetLink(event),
                                      "_blank"
                                    )
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Calendar className="w-4 h-4 text-green-600" />
                                  <div>
                                    <div className="font-medium">
                                      Calendar + Meet
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Add to Google Calendar
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    window.open(
                                      "https://zoom.us/start/videomeeting",
                                      "_blank"
                                    )
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Video className="w-4 h-4 text-purple-600" />
                                  <div>
                                    <div className="font-medium">Zoom</div>
                                    <div className="text-xs text-gray-500">
                                      Start instant meeting
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    window.open(
                                      "https://teams.microsoft.com/start",
                                      "_blank"
                                    )
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Video className="w-4 h-4 text-blue-800" />
                                  <div>
                                    <div className="font-medium">
                                      Microsoft Teams
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Start meeting
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                generateGoogleCalendarLink(event),
                                "_blank"
                              );
                            }}
                            className="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                          >
                            <Calendar className="w-2 h-2" />
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <div className="font-medium">
                        {event.title || "Mentorship Session"}
                      </div>
                      <div>
                        With:{" "}
                        {user?.role === "mentor" ? event.mentee : event.mentor}
                      </div>
                      <div>Status: {event.status}</div>
                      {event.time && <div>Time: {event.time}</div>}
                      {event.note && <div>Note: {event.note}</div>}
                      {event.meetingLink && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="text-blue-600">
                            Click "Join" to start meeting
                          </div>
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {events.length > 3 && (
              <div className="text-xs text-gray-500">
                +{events.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {DAYS.map((day) => (
          <div
            key={day}
            className="p-3 bg-gray-100 text-center font-medium text-gray-700 border-b border-gray-200"
          >
            {day}
          </div>
        ))}
        {calendarDays}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      days.push(day);
    }

    return (
      <div className="grid grid-cols-8 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-3 bg-gray-100 border-b border-gray-200"></div>
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="p-3 bg-gray-100 text-center font-medium text-gray-700 border-b border-gray-200"
          >
            <div>{format(day, "EEE")}</div>
            <div
              className={`text-lg ${
                isSameDay(day, new Date()) ? "text-blue-600 font-bold" : ""
              }`}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}

        {/* Time slots */}
        {Array.from({ length: 24 }, (_, hour) => (
          <div key={hour} className="contents">
            <div className="p-2 text-sm text-gray-600 border-b border-gray-100 bg-gray-50">
              {format(new Date().setHours(hour, 0, 0, 0), "HH:mm")}
            </div>
            {days.map((day) => {
              const dayEvents = getEventsForDate(day).filter(
                (event) =>
                  !event.isAllDay && event.startTime.getHours() === hour
              );

              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="p-1 min-h-[60px] border-b border-gray-100"
                >
                  {dayEvents.map((event) => (
                    <TooltipProvider key={event.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`text-xs p-2 rounded mb-1 ${getStatusColor(
                              event.status
                            )} cursor-pointer hover:shadow-sm transition-shadow`}
                          >
                            <div className="font-medium flex items-center gap-1">
                              {event.title || "Session"}
                              {event.meetingLink && (
                                <Video className="w-3 h-3 text-blue-600" />
                              )}
                            </div>
                            <div className="opacity-75">
                              {user?.role === "mentor"
                                ? event.mentee
                                : event.mentor}
                            </div>
                            {event.meetingLink && (
                              <div className="flex items-center gap-1 mt-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(event.meetingLink, "_blank");
                                  }}
                                  className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                                >
                                  <Video className="w-2 h-2" />
                                  Join
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(
                                      generateGoogleCalendarLink(event),
                                      "_blank"
                                    );
                                  }}
                                  className="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                                >
                                  <Calendar className="w-2 h-2" />
                                  Add
                                </button>
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">
                              {event.title || "Mentorship Session"}
                            </div>
                            <div>
                              With:{" "}
                              {user?.role === "mentor"
                                ? event.mentee
                                : event.mentor}
                            </div>
                            <div>Status: {event.status}</div>
                            {event.time && <div>Time: {event.time}</div>}
                            {event.note && <div>Note: {event.note}</div>}
                            {event.meetingLink && (
                              <div className="mt-2 pt-2 border-t">
                                <div className="text-blue-600">
                                  Click "Join" to start meeting
                                </div>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading calendar...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Booking Calendar</span>
          </CardTitle>

          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={view}
              onValueChange={(value: "month" | "week" | "day") =>
                setView(value)
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={exportToCalendar}
              className="flex items-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                view === "month"
                  ? navigateMonth("prev")
                  : view === "week"
                  ? navigateWeek("prev")
                  : navigateDay("prev")
              }
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <h2 className="text-xl font-semibold">
              {view === "month" && `${MONTHS[month]} ${year}`}
              {view === "week" &&
                `Week of ${format(startOfWeek(currentDate), "MMM d, yyyy")}`}
            </h2>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                view === "month"
                  ? navigateMonth("next")
                  : view === "week"
                  ? navigateWeek("next")
                  : navigateDay("next")
              }
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {view === "month" && renderMonthView()}
        {view === "week" && renderWeekView()}

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
            <span className="text-sm text-gray-600">Approved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
            <span className="text-sm text-gray-600">Denied</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
