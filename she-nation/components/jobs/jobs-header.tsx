"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";

export function JobsHeader() {
  const { user } = useAppSelector((state) => state.auth);
  const canPostJob = user && user.role !== "mentee";

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold font-poppins mb-4">
            Find Your Dream Opportunity
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover amazing career opportunities and connect with top companies
            in the tech industry
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {canPostJob && (
            <>
              <Link href="/jobs/create">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Post a Opportunity
                </Button>
              </Link>
              <Link href="/jobs/applicants">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600 font-semibold bg-transparent"
                >
                  <Users className="w-5 h-5 mr-2" />
                  View Applicants
                </Button>
              </Link>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
}
