"use client";

import { useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import type { Booking } from "@/lib/types/api";

interface BookingDecisionButtonsProps {
  booking: Booking;
  onDecisionMade?: (bookingId: number, decision: "approved" | "denied") => void;
}

export function BookingDecisionButtons({
  booking,
  onDecisionMade,
}: BookingDecisionButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDecision = async (action: "approve" | "deny") => {
    if (isLoading) return;

    const confirmMessage =
      action === "approve"
        ? `Are you sure you want to approve the booking with ${booking.mentee}?`
        : `Are you sure you want to deny the booking with ${booking.mentee}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
      const response = await fetch(
        `${baseUrl}/api/auth/bookings/${booking.id}/decide/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ action }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const status = action === "approve" ? "approved" : "denied";
        toast.success(data.detail || `Booking ${status} successfully!`);
        onDecisionMade?.(booking.id, status);
      } else {
        toast.error(data.detail || `Failed to ${action} booking`);
      }
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      toast.error(`Failed to ${action} booking`);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show buttons if booking is not pending
  if (booking.status !== "pending") {
    return (
      <div className="flex items-center space-x-2">
        <div
          className={`inline-flex items-center px-2 py-1 text-xs rounded-full capitalize ${
            booking.status === "approved"
              ? "bg-green-100 text-green-600"
              : booking.status === "denied"
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {booking.status === "approved" && <Check className="w-3 h-3 mr-1" />}
          {booking.status === "denied" && <X className="w-3 h-3 mr-1" />}
          {booking.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
          {booking.status}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDecision("approve")}
        disabled={isLoading}
        title="Approve Booking"
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        <Check className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDecision("deny")}
        disabled={isLoading}
        title="Deny Booking"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <X className="w-4 h-4" />
      </Button>
      <div className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </div>
    </div>
  );
}

// Alternative API-based version using RTK Query
interface BookingDecisionButtonsApiProps {
  booking: Booking;
  onDecisionMade?: (bookingId: number, decision: "approved" | "denied") => void;
}

export function BookingDecisionButtonsApi({
  booking,
  onDecisionMade,
}: BookingDecisionButtonsApiProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDecision = async (action: "approve" | "deny") => {
    if (isLoading) return;

    const confirmMessage =
      action === "approve"
        ? `Are you sure you want to approve the booking with ${booking.mentee}?`
        : `Are you sure you want to deny the booking with ${booking.mentee}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsLoading(true);

    try {
      // This would use the RTK Query mutation when implemented
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
      const response = await fetch(
        `${baseUrl}/api/auth/bookings/${booking.id}/decide/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ action }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const status = action === "approve" ? "approved" : "denied";
        toast.success(data.detail || `Booking ${status} successfully!`);
        onDecisionMade?.(booking.id, status);
      } else {
        toast.error(data.detail || `Failed to ${action} booking`);
      }
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      toast.error(`Failed to ${action} booking`);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show buttons if booking is not pending
  if (booking.status !== "pending") {
    return (
      <div className="flex items-center space-x-2">
        <div
          className={`inline-flex items-center px-2 py-1 text-xs rounded-full capitalize ${
            booking.status === "approved"
              ? "bg-green-100 text-green-600"
              : booking.status === "denied"
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {booking.status === "approved" && <Check className="w-3 h-3 mr-1" />}
          {booking.status === "denied" && <X className="w-3 h-3 mr-1" />}
          {booking.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
          {booking.status}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDecision("approve")}
        disabled={isLoading}
        title="Approve Booking"
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        <Check className="w-4 h-4" />
        {isLoading ? "Processing..." : "Approve"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDecision("deny")}
        disabled={isLoading}
        title="Deny Booking"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <X className="w-4 h-4" />
        {isLoading ? "Processing..." : "Deny"}
      </Button>
    </div>
  );
}
