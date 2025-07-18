"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateOpportunityMutation } from "@/lib/api/opportunitiesApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { OpportunityPayload } from "@/lib/types/api";

export function CreateJobForm() {
  const router = useRouter();
  const [createOpportunity, { isLoading }] = useCreateOpportunityMutation();

  const [formData, setFormData] = useState<OpportunityPayload>({
    title: "",
    type: "",
    description: "",
    eligibility_criteria: "",
    location: "",
    deadline: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Remote",
    "Freelance",
    "Temporary",
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.type) {
      newErrors.type = "Job type is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    }

    if (!formData.eligibility_criteria.trim()) {
      newErrors.eligibility_criteria = "Eligibility criteria is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Application deadline is required";
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate <= today) {
        newErrors.deadline = "Deadline must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof OpportunityPayload,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const result = await createOpportunity(formData).unwrap();
      toast.success("Job posted successfully!");
      router.push("/jobs");
    } catch (error: any) {
      console.error("Error creating job:", error);
      toast.error(
        error?.data?.detail || "Failed to create job. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/jobs">
          <Button
            type="button"
            variant="outline"
            className="flex items-center bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Job Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleInputChange("type", value)}
          >
            <SelectTrigger className={errors.type ? "border-red-500" : ""}>
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="e.g. San Francisco, CA or Remote"
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Application Deadline *</Label>
          <Input
            id="deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => handleInputChange("deadline", e.target.value)}
            min={
              new Date(Date.now() + 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            }
            className={errors.deadline ? "border-red-500" : ""}
          />
          {errors.deadline && (
            <p className="text-sm text-red-500">{errors.deadline}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Job Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Describe the role, responsibilities, and what you're looking for..."
          rows={6}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="eligibility_criteria">Eligibility Criteria *</Label>
        <Textarea
          id="eligibility_criteria"
          value={formData.eligibility_criteria}
          onChange={(e) =>
            handleInputChange("eligibility_criteria", e.target.value)
          }
          placeholder="List the requirements, qualifications, and skills needed for this position..."
          rows={4}
          className={errors.eligibility_criteria ? "border-red-500" : ""}
        />
        {errors.eligibility_criteria && (
          <p className="text-sm text-red-500">{errors.eligibility_criteria}</p>
        )}
      </div>

      <div className="flex items-center text-black space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleInputChange("is_active", checked)}
        />
        <Label htmlFor="is_active">Active Job Posting</Label>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t">
        <Link href="/jobs">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Creating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Post Job
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
