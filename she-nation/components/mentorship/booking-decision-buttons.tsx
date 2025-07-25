"use client";

import { useState } from "react";
import { Check, X, Clock, Video, Link, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { getAuthToken } from "@/lib/auth/auth-service";
import type { Booking } from "@/lib/types/api";

interface BookingDecisionButtonsProps {
  booking: Booking;
  onDecisionMade?: (
    bookingId: number,
    decision: "approved" | "denied" | "cancelled"
  ) => void;
}

export function BookingDecisionButtons({
  booking,
  onDecisionMade,
}: BookingDecisionButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [googleMeetLink, setGoogleMeetLink] = useState("");

  const handleDecision = async (
    action: "approve" | "deny" | "cancel",
    meetLink?: string
  ) => {
    if (isLoading) return;

    const confirmMessage =
      action === "approve"
        ? `Are you sure you want to approve the booking with ${booking.mentee}?`
        : action === "deny"
        ? `Are you sure you want to deny the booking with ${booking.mentee}?`
        : `Are you sure you want to cancel the booking with ${booking.mentee}?`;

    if (!confirm(confirmMessage)) return;

    setIsLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
      const token = getAuthToken();

      if (!token) {
        toast.error("❌ Authentication required. Please log in again.");
        return;
      }

      const response = await fetch(
        `${baseUrl}/api/auth/bookings/${booking.id}/decide/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Same style as DELETE
          },
          body: JSON.stringify({
            action,
            google_meet_link: meetLink || null,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const statusMap = {
          approve: "approved",
          deny: "denied",
          cancel: "cancelled",
        };

        toast.success(
          data.detail || `✅ Booking ${statusMap[action]} successfully.`
        );
        onDecisionMade?.(booking.id, statusMap[action] as any);
      } else {
        let errorMessage = `Failed to ${action} booking`;

        if (response.status === 401) {
          errorMessage = "Authentication required. Please log in again.";
        } else if (response.status === 403) {
          errorMessage = "You don't have permission to perform this action.";
        } else if (response.status === 404) {
          errorMessage = "Booking not found.";
        } else if (data.detail) {
          errorMessage = data.detail;
        }

        toast.error(`❌ ${errorMessage}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      toast.error(
        `❌ Network error. Failed to ${action} booking. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveClick = () => setShowApprovalDialog(true);

  const handleApprovalConfirm = async () => {
    await handleDecision("approve", googleMeetLink);
    setShowApprovalDialog(false);
    setGoogleMeetLink("");
  };

  const handleApprovalCancel = () => {
    setShowApprovalDialog(false);
    setGoogleMeetLink("");
  };

  const generateGoogleMeetLink = () => {
    window.open("https://meet.google.com/new", "_blank");
  };

  if (booking.status !== "pending") {
    return (
      <div className="flex items-center space-x-2">
        <div
          className={`inline-flex items-center px-2 py-1 text-xs rounded-full capitalize ${
            booking.status === "approved"
              ? "bg-green-100 text-green-600"
              : booking.status === "denied"
              ? "bg-red-100 text-red-600"
              : booking.status === "cancelled"
              ? "bg-gray-100 text-gray-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {booking.status === "approved" && <Check className="w-3 h-3 mr-1" />}
          {booking.status === "denied" && <X className="w-3 h-3 mr-1" />}
          {booking.status === "cancelled" && <Ban className="w-3 h-3 mr-1" />}
          {booking.status}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleApproveClick}
          disabled={isLoading}
          title="Approve Booking & Add Google Meet"
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

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDecision("cancel")}
          disabled={isLoading}
          title="Cancel Booking"
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <Ban className="w-4 h-4" />
        </Button>

        <div className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </div>
      </div>

      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-green-600" />
              Approve Booking & Add Google Meet
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">
                Session Details:
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Mentee:</strong> {booking.mentee}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(booking.day).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {booking.time || "Not specified"}
                </p>
                <p>
                  <strong>Title:</strong>{" "}
                  {booking.title || "Mentorship Session"}
                </p>
                {booking.note && (
                  <p>
                    <strong>Note:</strong> {booking.note}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="meetLink" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                Google Meet Link (Optional)
              </Label>
              <Input
                id="meetLink"
                type="url"
                value={googleMeetLink}
                onChange={(e) => setGoogleMeetLink(e.target.value)}
                placeholder="https://meet.google.com/xxx-yyyy-zzz"
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateGoogleMeetLink}
                  className="flex items-center gap-1"
                >
                  <Video className="w-3 h-3" />
                  Create New Meeting
                </Button>
                <span className="text-xs text-gray-500">
                  Click to open Google Meet and create a new room
                </span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> You can approve without a meeting link
                and add it later.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleApprovalCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleApprovalConfirm}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? "Approving..." : "Approve Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
