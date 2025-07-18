"use client";

import { useState } from "react";
import { Check, X, CheckSquare, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import type { Booking } from "@/lib/types/api";

interface BulkBookingActionsProps {
  bookings: Booking[];
  onBulkActionComplete?: () => void;
}

export function BulkBookingActions({
  bookings,
  onBulkActionComplete,
}: BulkBookingActionsProps) {
  const [selectedBookings, setSelectedBookings] = useState<Set<number>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [bulkAction, setBulkAction] = useState<"approve" | "deny" | "">("");

  // Filter only pending bookings for bulk actions
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );

  const handleSelectAll = () => {
    if (selectedBookings.size === pendingBookings.length) {
      setSelectedBookings(new Set());
    } else {
      setSelectedBookings(
        new Set(pendingBookings.map((booking) => booking.id))
      );
    }
  };

  const handleSelectBooking = (bookingId: number) => {
    const newSelected = new Set(selectedBookings);
    if (newSelected.has(bookingId)) {
      newSelected.delete(bookingId);
    } else {
      newSelected.add(bookingId);
    }
    setSelectedBookings(newSelected);
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedBookings.size === 0) {
      toast.error("Please select bookings and an action");
      return;
    }

    const confirmMessage = `Are you sure you want to ${bulkAction} ${selectedBookings.size} booking(s)?`;
    if (!confirm(confirmMessage)) {
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
      const response = await fetch(
        `${baseUrl}/api/auth/bookings/bulk-actions/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            action: bulkAction,
            booking_ids: Array.from(selectedBookings),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const { successful_count, failed_count } = data;

        if (successful_count > 0) {
          toast.success(
            `Successfully ${bulkAction}d ${successful_count} booking(s)${
              failed_count > 0 ? `. ${failed_count} failed.` : ""
            }`
          );
        }

        if (failed_count > 0 && successful_count === 0) {
          toast.error(`Failed to ${bulkAction} ${failed_count} booking(s)`);
        }

        // Reset selections
        setSelectedBookings(new Set());
        setBulkAction("");

        // Notify parent component
        onBulkActionComplete?.();
      } else {
        toast.error(data.detail || `Failed to ${bulkAction} bookings`);
      }
    } catch (error) {
      console.error("Bulk action error:", error);
      toast.error(`Failed to ${bulkAction} bookings`);
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingBookings.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-gray-600">
          No pending bookings available for bulk actions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Actions</h3>

      {/* Selection Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="flex items-center space-x-2"
          >
            {selectedBookings.size === pendingBookings.length ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            <span>
              {selectedBookings.size === pendingBookings.length
                ? "Deselect All"
                : "Select All"}
            </span>
          </Button>

          <span className="text-sm text-gray-600">
            {selectedBookings.size} of {pendingBookings.length} selected
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Select
            value={bulkAction}
            onValueChange={(value: "approve" | "deny") => setBulkAction(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approve">Approve</SelectItem>
              <SelectItem value="deny">Deny</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleBulkAction}
            disabled={isLoading || selectedBookings.size === 0 || !bulkAction}
            className="flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : bulkAction === "approve" ? (
              <Check className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
            <span>
              {isLoading
                ? "Processing..."
                : `${bulkAction || "Apply"} Selected`}
            </span>
          </Button>
        </div>
      </div>

      {/* Booking List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {pendingBookings.map((booking) => (
          <div
            key={booking.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedBookings.has(booking.id)
                ? "bg-blue-50 border-blue-200"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
            onClick={() => handleSelectBooking(booking.id)}
          >
            <div className="flex-shrink-0">
              {selectedBookings.has(booking.id) ? (
                <CheckSquare className="w-5 h-5 text-blue-600" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {booking.title || "Mentorship Session"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.mentee} •{" "}
                    {new Date(booking.day).toLocaleDateString()}
                    {booking.time && ` • ${booking.time}`}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedBookings.size > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>{selectedBookings.size}</strong> booking(s) selected for
            bulk action.
            {bulkAction && (
              <span className="ml-1">
                Click "{bulkAction === "approve" ? "Approve" : "Deny"} Selected"
                to proceed.
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

// Hook for bulk booking actions API
export function useBulkBookingActions() {
  const [isLoading, setIsLoading] = useState(false);

  const performBulkAction = async (
    action: "approve" | "deny",
    bookingIds: number[]
  ) => {
    setIsLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
      const response = await fetch(
        `${baseUrl}/api/auth/bookings/bulk-actions/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            action,
            booking_ids: bookingIds,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data,
        };
      } else {
        return {
          success: false,
          error: data.detail || `Failed to ${action} bookings`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to ${action} bookings`,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    performBulkAction,
    isLoading,
  };
}
