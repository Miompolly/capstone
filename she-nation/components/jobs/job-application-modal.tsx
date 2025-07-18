"use client";

import type React from "react";

import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { X, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Opportunity, ApplicationPayload } from "@/lib/types/api";

interface JobApplicationModalProps {
  opportunity: Opportunity;
  onClose: () => void;
  onSubmit: (data: ApplicationPayload) => Promise<void>;
  isLoading: boolean;
}

export function JobApplicationModal({
  opportunity,
  onClose,
  onSubmit,
  isLoading,
}: JobApplicationModalProps) {
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<ApplicationPayload>({
    full_name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    resume_url: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.resume_url.trim()) {
      newErrors.resume_url = "Resume URL is required";
    } else if (!isValidUrl(formData.resume_url)) {
      newErrors.resume_url = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (
    field: keyof ApplicationPayload,
    value: string
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
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-900">
            Apply for {opportunity.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">
              Application Information
            </h3>
            <p className="text-sm text-purple-800">
              Please fill out all required fields to submit your application for
              this position.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="Enter your full name"
                className={errors.full_name ? "border-red-500" : ""}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Enter your phone number"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume_url">Resume URL *</Label>
            <div className="relative">
              <Input
                id="resume_url"
                value={formData.resume_url}
                onChange={(e) =>
                  handleInputChange("resume_url", e.target.value)
                }
                placeholder="https://drive.google.com/file/d/your-resume-link"
                className={`pl-10 ${errors.resume_url ? "border-red-500" : ""}`}
              />
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.resume_url && (
              <p className="text-sm text-red-500">{errors.resume_url}</p>
            )}
            <p className="text-xs text-gray-600">
              Please provide a link to your resume (Google Drive, Dropbox, etc.)
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Job Details</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Position:</strong> {opportunity.title}
              </p>
              <p>
                <strong>Type:</strong> {opportunity.type}
              </p>
              <p>
                <strong>Location:</strong> {opportunity.location}
              </p>
              <p>
                <strong>Deadline:</strong>{" "}
                {new Date(opportunity.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
