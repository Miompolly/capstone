"use client";

import { useState } from "react";
import { Calendar, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RescheduleModal } from "@/components/sessions/reschedule-modal";

function SessionsPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  // Mock session data - replace with API data
  const sessions = [
    {
      id: "1",
      mentee: "Sarah Johnson",
      mentor: "Dr. Emily Chen",
      topic: "Career Transition",
      date: "2024-02-15",
      time: "2:00 PM",
      status: "upcoming",
    },
    {
      id: "2",
      mentee: "Maria Rodriguez",
      mentor: "David Lee",
      topic: "Leadership Skills",
      date: "2024-02-20",
      time: "10:00 AM",
      status: "completed",
    },
    {
      id: "3",
      mentee: "Lisa Chen",
      mentor: "Dr. Emily Chen",
      topic: "Work-Life Balance",
      date: "2024-02-22",
      time: "3:00 PM",
      status: "cancelled",
    },
  ];

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.mentee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.mentor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReschedule = (session: any) => {
    setSelectedSession(session);
    setShowRescheduleModal(true);
  };

  const handleCancel = (sessionId: string) => {
    // Implement cancel logic
  };

  const sessionStatuses = ["upcoming", "completed", "cancelled"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
        <p className="text-gray-600">Manage your mentorship sessions</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {sessionStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">
                  Mentee
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">
                  Mentor
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">
                  Topic
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">
                  Date
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">
                  Time
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">{session.mentee}</td>
                  <td className="py-4 px-6">{session.mentor}</td>
                  <td className="py-4 px-6">{session.topic}</td>
                  <td className="py-4 px-6">{session.date}</td>
                  <td className="py-4 px-6">{session.time}</td>
                  <td className="py-4 px-6">{session.status}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReschedule(session)}
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleCancel(session.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <RescheduleModal
          session={selectedSession}
          onClose={() => setShowRescheduleModal(false)}
        />
      )}
    </div>
  );
}

export default SessionsPageContent;
