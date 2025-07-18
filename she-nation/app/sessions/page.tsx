"use client";

import SessionsPageContent from "@/components/sessions/sessions-page-content";
import { AuthGuard } from "@/components/auth/auth-guard";

function SessionsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SessionsPageContent />
        </div>
      </div>
    </AuthGuard>
  );
}

export default SessionsPage;
