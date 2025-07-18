// pages/course/[id].tsx or app/course/[id]/page.tsx
"use client";

import { CourseHeader } from "@/components/courses/course-header";
import { CourseSidebar } from "@/components/courses/course-sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useParams } from "next/navigation";
import { CourseContent } from "@/components/courses/course-content";

// No CoursePageProps needed if using useParams directly within the component
// interface CoursePageProps {
//   params: { id: string };
// }

function CoursePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CourseHeader courseId={id} />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6 ">
            <div className="lg:col-span-3 border">
              <CourseContent courseId={id} />
            </div>
            <div className="lg:col-span-1">
              <CourseSidebar courseId={id} />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default CoursePage;
