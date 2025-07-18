"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Building2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/hooks";
import { useDeleteOpportunityMutation } from "@/lib/api/opportunitiesApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Opportunity } from "@/lib/types/api";

interface JobDetailsHeaderProps {
  opportunity: Opportunity;
}

export function JobDetailsHeader({ opportunity }: JobDetailsHeaderProps) {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [deleteOpportunity, { isLoading: isDeleting }] =
    useDeleteOpportunityMutation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Full-time": "bg-green-100 text-green-800",
      "Part-time": "bg-blue-100 text-blue-800",
      Contract: "bg-purple-100 text-purple-800",
      Internship: "bg-orange-100 text-orange-800",
      Remote: "bg-indigo-100 text-indigo-800",
      Freelance: "bg-pink-100 text-pink-800",
      Temporary: "bg-yellow-100 text-yellow-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil(
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilDeadline <= 7;
  };

  const canDeleteJob = user && opportunity.created_by === user.id;

  const handleDeleteJob = async () => {
    try {
      await deleteOpportunity(opportunity.id).unwrap();
      toast.success("Job deleted successfully");
      router.push("/jobs");
    } catch (error) {
      toast.error("Failed to delete job");
      console.error("Delete job error:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {opportunity.title}
          </h1>
          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              <span>SheNation Opportunity</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{opportunity.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>
                Posted{" "}
                {formatDistanceToNow(new Date(opportunity.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-3">
          <div className="flex items-center space-x-2">
            <Badge
              className={getTypeColor(opportunity.type)}
              variant="secondary"
            >
              {opportunity.type}
            </Badge>
            {canDeleteJob && (
              <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="ml-2">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Job Opportunity</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this job opportunity? This
                      action cannot be undone and will remove all associated
                      applications.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteJob}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? "Deleting..." : "Delete Job"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          {isDeadlineApproaching(opportunity.deadline) && (
            <Badge variant="destructive">
              <Calendar className="w-4 h-4 mr-1" />
              Deadline Soon
            </Badge>
          )}
          {!opportunity.is_active && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              Inactive
            </Badge>
          )}
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                Application deadline:{" "}
                {new Date(opportunity.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
