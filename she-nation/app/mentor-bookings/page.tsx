"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  MessageSquare,
  Check,
  X,
  Trash2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetMentorBookingsQuery,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
} from "@/lib/api/bookingApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AuthGuard } from "@/components/auth/auth-guard";
import { BulkBookingActions } from "@/components/mentorship/bulk-booking-actions";
import toast from "react-hot-toast";
import type { Booking } from "@/lib/types/api";

function MentorBookingsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: bookings = [],
    isLoading,
    error,
    refetch,
  } = useGetMentorBookingsQuery();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [deleteBooking] = useDeleteBookingMutation();

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.mentee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      "";
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveBooking = async (booking: Booking) => {
    try {
      await updateBookingStatus({
        id: booking.id,
        status: { status: "approved" },
      }).unwrap();
      toast.success(`Booking with ${booking.mentee} has been approved`);
    } catch (error) {
      toast.error("Failed to approve booking");
    }
  };

  const handleDenyBooking = async (booking: Booking) => {
    if (
      !confirm(
        `Are you sure you want to deny the booking with ${booking.mentee}?`
      )
    ) {
      return;
    }

    try {
      await updateBookingStatus({
        id: booking.id,
        status: { status: "denied" },
      }).unwrap();
      toast.success(`Booking with ${booking.mentee} has been denied`);
    } catch (error) {
      toast.error("Failed to deny booking");
    }
  };

  const handleDeleteBooking = async (booking: Booking) => {
    if (
      !confirm(
        `Are you sure you want to delete the booking with ${booking.mentee}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteBooking(booking.id).unwrap();
      toast.success(`Booking with ${booking.mentee} has been deleted`);
    } catch (error) {
      toast.error("Failed to delete booking");
    }
  };

  const handleBulkActionComplete = () => {
    // Refetch bookings after bulk action
    refetch();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-600";
      case "denied":
        return "bg-red-100 text-red-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="w-4 h-4" />;
      case "denied":
        return <X className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Bookings
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Mentor Booking Requests
              </h1>
              <p className="text-gray-600">
                Manage your mentorship booking requests
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter((b) => b.status === "pending").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter((b) => b.status === "approved").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Denied</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter((b) => b.status === "denied").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <BulkBookingActions
          bookings={filteredBookings}
          onBulkActionComplete={handleBulkActionComplete}
        />

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Mentee
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Session Details
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Date & Time
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
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.mentee}
                          </p>
                          <p className="text-sm text-gray-600">
                            Requested on{" "}
                            {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.title || "Mentorship Session"}
                        </p>
                        {booking.note && (
                          <p className="text-sm text-gray-600 mt-1">
                            <MessageSquare className="w-4 h-4 inline mr-1" />
                            {booking.note}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(booking.day).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.time || "Time not specified"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApproveBooking(booking)}
                              title="Approve Booking"
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDenyBooking(booking)}
                              title="Deny Booking"
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBooking(booking)}
                          title="Delete Booking"
                          className="text-red-600 hover:text-red-700"
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

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600">
                No booking requests match your current search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MentorBookingsPageWithAuth() {
  return (
    <AuthGuard allowedRoles={["mentor", "Mentor", "admin"]}>
      <MentorBookingsPage />
    </AuthGuard>
  );
}
