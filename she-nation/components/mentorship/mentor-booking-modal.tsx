"use client";

import type React from "react";

import { useState } from "react";
import { Calendar, Clock, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookMentorMutation } from "@/lib/api/bookingApi";
import { useAppSelector } from "@/lib/hooks";
import toast from "react-hot-toast";
import type { Mentor } from "@/lib/types/api";

interface MentorBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor | null;
}

const TIME_SLOTS = [
  "09:00:00",
  "09:30:00",
  "10:00:00",
  "10:30:00",
  "11:00:00",
  "11:30:00",
  "12:00:00",
  "12:30:00",
  "13:00:00",
  "13:30:00",
  "14:00:00",
  "14:30:00",
  "15:00:00",
  "15:30:00",
  "16:00:00",
  "16:30:00",
  "17:00:00",
  "17:30:00",
];

export function MentorBookingModal({
  isOpen,
  onClose,
  mentor,
}: MentorBookingModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionNote, setSessionNote] = useState("");
  const [bookMentor, { isLoading }] = useBookMentorMutation();
  const { user } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mentor || !selectedDate || !selectedTime || !sessionTitle.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate date is not in the past
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();
    if (selectedDateTime < now) {
      toast.error("Cannot book sessions in the past");
      return;
    }

    console.log("Booking submission:", {
      mentor: mentor.id,
      day: selectedDate,
      time: selectedTime,
      title: sessionTitle,
      note: sessionNote,
      userEmail: user?.email,
      userRole: user?.role,
    });

    try {
      console.log("Starting booking submission...");

      const bookingData = {
        mentor: mentor.id,
        day: selectedDate,
        time: selectedTime,
        title: sessionTitle,
        note: sessionNote,
      };

      console.log("Booking data to submit:", bookingData);

      const result = await bookMentor(bookingData).unwrap();

      console.log("Booking success:", result);

      toast.success(
        "🎉 Booking created successfully! Waiting for mentor approval."
      );

      // Reset form
      setSelectedDate("");
      setSelectedTime("");
      setSessionTitle("");
      setSessionNote("");
      onClose();
    } catch (error: any) {
      console.error("Booking error details:", {
        error,
        status: error?.status,
        data: error?.data,
        message: error?.message,
        originalStatus: error?.originalStatus,
      });

      // More detailed error messages
      let errorMessage = "Failed to create booking";

      if (error?.status === 401) {
        errorMessage = "Authentication required. Please log in again.";
      } else if (error?.status === 403) {
        errorMessage = "You don't have permission to create bookings.";
      } else if (error?.status === 400) {
        errorMessage =
          error?.data?.message ||
          "Invalid booking data. Please check your inputs.";
      } else if (error?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(`❌ ${errorMessage}`);
    }
  };

  const formatTimeForDisplay = (time: string) => {
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

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (!mentor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Book Session with {mentor.name}
          </DialogTitle>
        </DialogHeader>

        {/* Mentor Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold text-lg">
                {mentor.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
              <p className="text-sm text-gray-600">{mentor.title}</p>
              <p className="text-sm text-gray-500">{mentor.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Select Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getTodayDate()}
              required
              className="w-full"
            />
            {selectedDate && (
              <p className="text-sm text-gray-600">
                Selected:{" "}
                {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            )}
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Select Time *
            </Label>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a time slot" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((time) => (
                  <SelectItem key={time} value={time}>
                    {formatTimeForDisplay(time)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Session Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Session Title *
            </Label>
            <Input
              id="title"
              type="text"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder="e.g., Career Guidance Session"
              required
              className="w-full"
            />
          </div>

          {/* Session Note */}
          <div className="space-y-2">
            <Label htmlFor="note" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Session Notes
            </Label>
            <Textarea
              id="note"
              value={sessionNote}
              onChange={(e) => setSessionNote(e.target.value)}
              placeholder="e.g., Focus on resume review and interview tips"
              rows={3}
              className="w-full"
            />
          </div>

          {/* Debug Info */}
          <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
            <strong>Debug Info:</strong>
            <br />
            User: {user?.email} ({user?.role})<br />
            Mentor ID: {mentor.id}
            <br />
            Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-black text-white"
            >
              {isLoading ? "Booking..." : "Book Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
