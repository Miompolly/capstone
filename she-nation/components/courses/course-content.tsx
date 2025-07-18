"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Lock,
  CheckCircle,
  Clock,
  FileText,
  Video,
  Download,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Star,
  PlusCircle,
  Trash2,
  Edit,
  X,
  Image, // New import for image icon
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { updateCourseProgress } from "@/lib/slices/coursesSlice";
import { addNotification } from "@/lib/slices/notificationsSlice";
import { useGetCourseByIdQuery } from "@/lib/api/coursesApi";
import {
  useCreateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useGetAllEnrollmentsQuery,
} from "@/lib/api/enrollmentsApi";
import {
  useCreateLessonProgressMutation,
  useGetAllLessonProgressQuery,
} from "@/lib/api/lessonProgressApi";
import {
  useGetAllLessonsQuery,
  useDeleteLessonMutation,
  useUpdateLessonMutation,
  useGetLessonByIdQuery,
} from "@/lib/api/lessonsApi";
import {
  useCreateReviewMutation,
  useGetAllReviewsQuery,
} from "@/lib/api/reviewsApi";
// Inside CourseContent.tsx
import { CreateLessonForm } from "@/components/CreateLessonForm";

// Assuming CourseContentProps is defined elsewhere, e.g., in types/components.ts
interface CourseContentProps {
  courseId: string; // Keep as string as it comes from URL params
}

interface Course {
  id: number;
  posted_by: string;
  title: string;
  category: string;
  description: string;
  certificate_available: boolean;
  level: string;
  price: string;
  duration_weeks: number;
  instructor_name: string;
  progress: number; // Assuming this comes from the course detail
}

interface Lesson {
  id: number;
  course_title: string;
  title: string;
  video_url: string | null;
  image_url: string | null; // NEW: Added for image display
  duration_minutes: number;
  order: number;
  course: number;
}

interface Review {
  id: number;
  user: { id: number; username: string };
  rating: number;
  comment: string;
  created_at: string;
}

interface Enrollment {
  id: number;
  progress: number;
  certificate_earned: boolean;
  enrolled_on: string;
  user: string; // The username string
  course: number;
  course_title: string;
}

interface LessonProgress {
  id: number;
  completed: boolean;
  watched_on: string;
  enrollment: number;
  lesson: number;
  lesson_name: string;
  course_title: string;
}

export function CourseContent({ courseId }: CourseContentProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const parsedCourseId = Number.parseInt(courseId);
  // Inside CourseContent component
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);
  const isMentor = user?.role === "Mentor";

  const {
    data: course,
    isLoading: isLoadingCourse,
    error: courseError,
    refetch: refetchCourse,
  } = useGetCourseByIdQuery(parsedCourseId);
  const {
    data: allLessonsData,
    isLoading: isLoadingLessons,
    error: lessonsError,
    refetch: refetchLessons,
  } = useGetAllLessonsQuery();

  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    error: reviewsError,
  } = useGetAllReviewsQuery(parsedCourseId);
  const {
    data: allEnrollmentsData,
    isLoading: isLoadingEnrollments,
    error: enrollmentsError,
    refetch: refetchEnrollments,
  } = useGetAllEnrollmentsQuery();
  const {
    data: allLessonProgressData,
    isLoading: isLoadingLessonProgress,
    error: lessonProgressError,
    refetch: refetchLessonProgress,
  } = useGetAllLessonProgressQuery();

  const [createEnrollment] = useCreateEnrollmentMutation();
  const [deleteEnrollment] = useDeleteEnrollmentMutation();
  const [createLessonProgress] = useCreateLessonProgressMutation();
  const [createReview] = useCreateReviewMutation();
  const [deleteLesson] = useDeleteLessonMutation();
  const [updateLesson] = useUpdateLessonMutation();

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [lessonCompletionStatus, setLessonCompletionStatus] = useState<
    Record<string, boolean>
  >({});
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [showEditLessonModal, setShowEditLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editLessonTitle, setEditLessonTitle] = useState("");
  const [editLessonVideoUrl, setEditLessonVideoUrl] = useState("");
  const [editLessonDuration, setEditLessonDuration] = useState(0);
  const [editLessonOrder, setEditLessonOrder] = useState(0);

  const courseLessons: Lesson[] = (allLessonsData || [])
    .filter((lesson) => lesson.course === parsedCourseId)
    .sort((a, b) => a.order - b.order);

  const isEnrolled =
    allEnrollmentsData?.some(
      (enrollment) =>
        enrollment.user === user?.name && enrollment.course === parsedCourseId
    ) || false;

  const currentUserEnrollment = allEnrollmentsData?.find(
    (enrollment) =>
      enrollment.user === user?.name && enrollment.course === parsedCourseId
  );
  const currentEnrollmentId = currentUserEnrollment?.id;

  useEffect(() => {
    if (user && currentUserEnrollment && allLessonProgressData) {
      const newCompletionStatus: Record<string, boolean> = {};
      allLessonProgressData.forEach((lp) => {
        if (lp.enrollment === currentUserEnrollment.id && lp.completed) {
          newCompletionStatus[lp.lesson.toString()] = true;
        }
      });
      setLessonCompletionStatus(newCompletionStatus);
    } else {
      setLessonCompletionStatus({});
    }
  }, [user, currentUserEnrollment, allLessonProgressData]);

  useEffect(() => {
    if (courseLessons.length > 0) {
      const completedCount = Object.values(lessonCompletionStatus).filter(
        Boolean
      ).length;
      const totalLessons = courseLessons.length;
      const newCourseProgress = Math.round(
        (completedCount / totalLessons) * 100
      );
      dispatch(
        updateCourseProgress({
          courseId: parsedCourseId.toString(),
          progress: newCourseProgress,
        })
      );
    } else {
      dispatch(
        updateCourseProgress({
          courseId: parsedCourseId.toString(),
          progress: 0,
        })
      );
    }
  }, [lessonCompletionStatus, courseLessons.length, parsedCourseId, dispatch]);

  if (
    isLoadingCourse ||
    isLoadingLessons ||
    isLoadingReviews ||
    isLoadingEnrollments ||
    isLoadingLessonProgress
  )
    return <div>Loading course content...</div>;
  if (courseError)
    return (
      <div>Error loading course: {courseError.message || "Unknown error"}</div>
    );
  if (lessonsError)
    return (
      <div>
        Error loading lessons: {lessonsError.message || "Unknown error"}
      </div>
    );
  if (reviewsError)
    return (
      <div>
        Error loading reviews: {reviewsError.message || "Unknown error"}
      </div>
    );
  if (enrollmentsError)
    return (
      <div>
        Error loading enrollments: {enrollmentsError.message || "Unknown error"}
      </div>
    );
  if (lessonProgressError)
    return (
      <div>
        Error loading lesson progress:{" "}
        {lessonProgressError.message || "Unknown error"}
      </div>
    );

  if (!course) return null;

  const currentLesson = courseLessons[activeLessonIndex];

  const getTotalLessons = () => courseLessons.length;
  const getCompletedLessons = () =>
    Object.values(lessonCompletionStatus).filter(Boolean).length;

  const handleEnrollCourse = async () => {
    if (!user) {
      dispatch(
        addNotification({
          title: "Login Required",
          message: "Please log in to enroll in this course",
          type: "error",
          read: false,
        })
      );
      return;
    }

    try {
      await createEnrollment({
        user: user.id,
        course: parsedCourseId,
      }).unwrap();
      dispatch(
        addNotification({
          title: "Enrolled Successfully",
          message: `You have been enrolled in "${course.title}"`,
          type: "success",
          read: false,
        })
      );
      refetchEnrollments();
      refetchLessonProgress();
    } catch (err: any) {
      dispatch(
        addNotification({
          title: "Enrollment Failed",
          message:
            err.data?.detail ||
            "Failed to enroll in the course. You might already be enrolled.",
          type: "error",
          read: false,
        })
      );
    }
  };

  const handleUnenrollCourse = async () => {
    if (!user) {
      dispatch(
        addNotification({
          title: "Login Required",
          message: "Please log in to unenroll.",
          type: "error",
          read: false,
        })
      );
      return;
    }

    if (!isEnrolled || !currentEnrollmentId) {
      dispatch(
        addNotification({
          title: "Not Enrolled",
          message: "You are not enrolled in this course.",
          type: "error",
          read: false,
        })
      );
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to unenroll from "${course.title}"? Your progress will be lost.`
      )
    ) {
      return;
    }

    try {
      await deleteEnrollment(currentEnrollmentId).unwrap();
      dispatch(
        addNotification({
          title: "Unenrolled Successfully",
          message: `You have been unenrolled from "${course.title}".`,
          type: "success",
          read: false,
        })
      );
      refetchEnrollments();
      refetchLessonProgress();
      setLessonCompletionStatus({});
      setActiveLessonIndex(0);
    } catch (err: any) {
      dispatch(
        addNotification({
          title: "Unenrollment Failed",
          message: err.data?.detail || "Failed to unenroll from the course.",
          type: "error",
          read: false,
        })
      );
    }
  };

  const handleLessonClick = (lessonIndex: number) => {
    if (isEnrolled || isMentor) {
      setActiveLessonIndex(lessonIndex);
    }
  };

  const markAsComplete = async () => {
    if (!currentLesson || !isEnrolled || !user || !currentUserEnrollment)
      return;

    const lessonKey = `${currentLesson.id}`;

    if (lessonCompletionStatus[lessonKey]) {
      dispatch(
        addNotification({
          title: "Already Completed",
          message: "This lesson is already marked as complete",
          type: "info",
          read: false,
        })
      );
      return;
    }

    try {
      await createLessonProgress({
        user: user.id,
        lesson: currentLesson.id,
        enrollment: currentUserEnrollment.id,
        completed: true,
      }).unwrap();

      const newCompletionStatus = {
        ...lessonCompletionStatus,
        [lessonKey]: true,
      };
      setLessonCompletionStatus(newCompletionStatus);

      dispatch(
        addNotification({
          title: "Lesson Completed!",
          message: `You've completed "${currentLesson.title}"`,
          type: "success",
          read: false,
        })
      );

      setTimeout(() => {
        navigateToNext();
      }, 1000);
    } catch (err: any) {
      dispatch(
        addNotification({
          title: "Completion Failed",
          message: err.data?.detail || "Failed to mark lesson as complete.",
          type: "error",
          read: false,
        })
      );
    }
  };

  const handleDeleteLesson = async (lessonId: number, lessonTitle: string) => {
    if (!isMentor) {
      dispatch(
        addNotification({
          title: "Unauthorized",
          message: "Only mentors can delete lessons.",
          type: "error",
          read: false,
        })
      );
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete the lesson "${lessonTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteLesson(lessonId).unwrap();
      dispatch(
        addNotification({
          title: "Lesson Deleted",
          message: `Lesson "${lessonTitle}" has been successfully deleted.`,
          type: "success",
          read: false,
        })
      );
      refetchLessons();
      if (currentLesson?.id === lessonId) {
        setActiveLessonIndex(0);
      }
    } catch (err: any) {
      dispatch(
        addNotification({
          title: "Deletion Failed",
          message: err.data?.detail || "Failed to delete lesson.",
          type: "error",
          read: false,
        })
      );
    }
  };

  const handleEditLessonClick = (lesson: Lesson) => {
    if (!isMentor) {
      dispatch(
        addNotification({
          title: "Unauthorized",
          message: "Only mentors can edit lessons.",
          type: "error",
          read: false,
        })
      );
      return;
    }
    setEditingLesson(lesson);
    setEditLessonTitle(lesson.title);
    setEditLessonVideoUrl(lesson.video_url || "");
    setEditLessonDuration(lesson.duration_minutes || 0);
    setEditLessonOrder(lesson.order || 0);
    setShowEditLessonModal(true);
  };

  const handleUpdateLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson || !isMentor) return;

    console.log(
      editLessonTitle,
      editLessonVideoUrl,
      editLessonDuration,
      editLessonOrder
    );

    try {
      await updateLesson({
        id: editingLesson.id,
        lesson: {
          course: parsedCourseId,
          title: editLessonTitle,
          video_url: editLessonVideoUrl || null,
          duration_minutes: editLessonDuration,
          order: editLessonOrder,
        },
      }).unwrap();

      dispatch(
        addNotification({
          title: "Lesson Updated",
          message: `Lesson "${editLessonTitle}" updated successfully.`,
          type: "success",
          read: false,
        })
      );
      setShowEditLessonModal(false);
      setEditingLesson(null);
      refetchLessons();
    } catch (err: any) {
      dispatch(
        addNotification({
          title: "Update Failed",
          message: err.data?.detail || "Failed to update lesson.",
          type: "error",
          read: false,
        })
      );
    }
  };

  const navigateToNext = () => {
    if (activeLessonIndex < courseLessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    } else {
      dispatch(
        addNotification({
          title: "Course Completed!",
          message: `Congratulations! You've completed "${course.title}"`,
          type: "success",
          read: false,
        })
      );
    }
  };

  const navigateToPrevious = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
    }
  };

  const canNavigateNext = () => {
    return activeLessonIndex < courseLessons.length - 1;
  };

  const canNavigatePrevious = () => {
    return activeLessonIndex > 0;
  };

  const getLessonType = (lesson?: Lesson) => {
    if (!lesson) return "document";

    if (lesson.video_url) {
      return "video";
    }

    if (lesson.image_url) {
      return "image";
    }

    return "document";
  };
  

  const getIconForType = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      case "image": // NEW: Icon for image
        return <Image className="w-4 h-4" />;
      case "quiz":
        return <CheckCircle className="w-4 h-4" />;
      case "exercise":
        return <Download className="w-4 h-4" />;
      case "project":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      dispatch(
        addNotification({
          title: "Login Required",
          message: "Please log in to submit a review.",
          type: "error",
          read: false,
        })
      );
      return;
    }
    if (reviewRating === 0) {
      dispatch(
        addNotification({
          title: "Rating Required",
          message: "Please select a star rating for your review.",
          type: "error",
          read: false,
        })
      );
      return;
    }

    try {
      await createReview({
        courseId: parsedCourseId,
        review: {
          user: user.id,
          rating: reviewRating,
          comment: reviewComment,
        },
      }).unwrap();
      dispatch(
        addNotification({
          title: "Review Submitted",
          message: "Your review has been successfully submitted!",
          type: "success",
          read: false,
        })
      );
      setReviewRating(0);
      setReviewComment("");
      setShowReviewForm(false);
    } catch (err: any) {
      dispatch(
        addNotification({
          title: "Review Submission Failed",
          message:
            err.data?.detail ||
            "Failed to submit review. You might have already reviewed this course.",
          type: "error",
          read: false,
        })
      );
    }
  };

  return (
    <div className="space-y-6 bg-white">
      {/* Course Progress */}
      {isEnrolled && (
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Progress</h3>
            <span className="text-purple-600 font-bold">
              {course?.progress || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${course?.progress || 0}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {getCompletedLessons()} of {getTotalLessons()} lessons completed
          </p>
        </div>
      )}

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson List */}
        <div className="lg:col-span-1">
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Course Lessons</h3>
            <div className="space-y-2">
              {courseLessons.length > 0 ? (
                courseLessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between gap-2 p-3 border border-gray-200 rounded-lg"
                  >
                    <button
                      onClick={() => handleLessonClick(lessonIndex)}
                      disabled={!isEnrolled && !isMentor}
                      className={`flex-1 text-left flex items-center space-x-3 transition-colors ${
                        activeLessonIndex === lessonIndex
                          ? "bg-purple-100 text-purple-700"
                          : "hover:bg-gray-50"
                      } ${
                        !isEnrolled && !isMentor
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {lessonCompletionStatus[`${lesson.id}`] ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : isEnrolled || isMentor ? (
                          getIconForType(getLessonType(lesson))
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {lesson.title}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration_minutes} min</span>
                        </div>
                      </div>
                    </button>
                    {isMentor && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditLessonClick(lesson)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                          title={`Edit "${lesson.title}"`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteLesson(lesson.id, lesson.title)
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title={`Delete "${lesson.title}"`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  No lessons available for this course yet.
                </p>
              )}
              {isMentor && (
                <button
                  className="w-full mt-4 flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => setShowCreateLessonModal(true)}
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Add New Lesson
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Content Display Area */}
        <div className="lg:col-span-2">
          <div className="glass-effect rounded-xl p-6">
            {isEnrolled || isMentor ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    {currentLesson?.title || "Select a lesson"}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {currentLesson?.duration_minutes} min
                    </div>
                    <div className="flex items-center">
                      {getIconForType(
                        currentLesson ? getLessonType(currentLesson) : "video"
                      )}
                      <span className="ml-1 capitalize">
                        {currentLesson ? getLessonType(currentLesson) : "video"}
                      </span>
                    </div>
                    {currentLesson &&
                      lessonCompletionStatus[`${currentLesson.id}`] && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Completed
                        </div>
                      )}
                  </div>
                </div>

                {/* Video Player or Image Display Area */}
                {currentLesson?.video_url ? (
                  (() => {
                    const getYouTubeVideoId = (url: string) => {
                      const regExp =
                        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                      const match = url.match(regExp);
                      return match && match[2].length === 11 ? match[2] : null;
                    };

                    const videoId = getYouTubeVideoId(currentLesson.video_url);
                    if (videoId) {
                      return (
                        <iframe
                          width="100%"
                          height="360" // <-- fixed height added here
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={currentLesson.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-lg"
                        />
                      );
                    } else {
                      // fallback to normal video player for other video URLs
                      return (
                        <video
                          controls
                          src={currentLesson.video_url}
                          className="w-full h-full object-cover"
                          poster={currentLesson.image_url || undefined}
                        >
                          Your browser does not support the video tag.
                        </video>
                      );
                    }
                  })()
                ) : currentLesson?.image_url ? (
                  <img
                    src={currentLesson.image_url}
                    alt={currentLesson.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Content Display Area</p>
                    <p className="text-sm opacity-75">
                      {currentLesson?.title}
                      <br />
                      {getLessonType(currentLesson) === "document" &&
                        "View Document / Quiz"}
                    </p>
                  </div>
                )}

                {/* Navigation and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    {currentLesson &&
                      !lessonCompletionStatus[`${currentLesson.id}`] &&
                      isEnrolled && (
                        <button
                          onClick={markAsComplete}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                        >
                          Mark as Complete
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">
                  Enroll to Access Content
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of students and start learning today!
                </p>
                <button
                  onClick={handleEnrollCourse}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Enroll Now
                </button>
              </div>
            )}
            {/* Unenroll button - displayed only if user is enrolled and NOT a mentor */}
            {isEnrolled && user && !isMentor && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleUnenrollCourse}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Unenroll from Course
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="glass-effect rounded-xl p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
          <span>Student Reviews ({reviewsData?.length || 0})</span>
          {isEnrolled && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {showReviewForm ? "Cancel Review" : "Add Your Review"}
            </button>
          )}
        </h3>

        {showReviewForm && isEnrolled && (
          <form
            onSubmit={handleReviewSubmit}
            className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <h4 className="font-medium mb-3">Submit Your Review</h4>
            <div className="mb-3">
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rating:
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${
                      reviewRating >= star
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                    onClick={() => setReviewRating(star)}
                  />
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Comment:
              </label>
              <textarea
                id="comment"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Share your thoughts about this course..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Submit Review
            </button>
          </form>
        )}

        {reviewsData && reviewsData.length > 0 ? (
          <div className="space-y-4">
            {reviewsData.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center mb-2">
                  <p className="font-semibold mr-2">{review.user.username}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          review.rating > i
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                <p className="text-xs text-gray-500">
                  Reviewed on:{" "}
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No reviews yet. Be the first to review this course!
          </p>
        )}
      </div>

      {/* Edit Lesson Modal */}
      {showEditLessonModal && editingLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowEditLessonModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-6">
              Edit Lesson: {editingLesson.title}
            </h3>
            <form onSubmit={handleUpdateLessonSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="editTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="editTitle"
                  value={editLessonTitle}
                  onChange={(e) => setEditLessonTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editVideoUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  id="editVideoUrl"
                  value={editLessonVideoUrl}
                  onChange={(e) => setEditLessonVideoUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="editDuration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="editDuration"
                  value={editLessonDuration}
                  onChange={(e) =>
                    setEditLessonDuration(parseInt(e.target.value))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editOrder"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Order
                </label>
                <input
                  type="number"
                  id="editOrder"
                  value={editLessonOrder}
                  onChange={(e) => setEditLessonOrder(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditLessonModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateLessonModal && isMentor && (
        <CreateLessonForm
          courseId={parsedCourseId}
          onLessonCreated={() => {
            setShowCreateLessonModal(false); // Close modal on success
            refetchLessons(); // Re-fetch lessons to show the new one
          }}
          onCancel={() => setShowCreateLessonModal(false)} // Close modal on cancel
        />
      )}
    </div>
  );
}
