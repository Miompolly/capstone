"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RescheduleModalProps {
  session: any;
  onClose: () => void;
}

export function RescheduleModal({ session, onClose }: RescheduleModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Reschedule Session
        </h3>
        <p className="text-gray-600 mb-6">
          Select a new date and time for your session with {session.mentor}
        </p>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="newDate"
              className="text-sm font-medium text-gray-700"
            >
              New Date
            </Label>
            <Input type="date" id="newDate" className="w-full" />
          </div>

          <div>
            <Label
              htmlFor="newTime"
              className="text-sm font-medium text-gray-700"
            >
              New Time
            </Label>
            <Input type="time" id="newTime" className="w-full" />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button>Reschedule</Button>
        </div>
      </div>
    </div>
  );
}
