"use client";

import React, { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { useCreateLessonMutation } from "@/lib/api/lessonsApi";
import { addNotification } from "@/lib/slices/notificationsSlice";
import { useAppDispatch } from "@/lib/hooks";

interface CreateLessonFormProps {
  courseId: number;
  onLessonCreated: () => void;
  onCancel: () => void;
}

// ✅ Helper to extract YouTube video ID from any YouTube URL
function extractYouTubeId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function CreateLessonForm({
  courseId,
  onLessonCreated,
  onCancel,
}: CreateLessonFormProps) {
  const dispatch = useAppDispatch();
  const [createLesson] = useCreateLessonMutation();

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [order, setOrder] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      dispatch(
        addNotification({
          title: "Validation Error",
          message: "Lesson title cannot be empty.",
          type: "error",
          read: false,
        })
      );
      return;
    }

    if (durationMinutes <= 0) {
      dispatch(
        addNotification({
          title: "Validation Error",
          message: "Duration must be a positive number.",
          type: "error",
          read: false,
        })
      );
      return;
    }

    if (order <= 0) {
      dispatch(
        addNotification({
          title: "Validation Error",
          message: "Order must be a positive number.",
          type: "error",
          read: false,
        })
      );
      return;
    }

    try {
      await createLesson({
        course: courseId,
        title,
        video_url: videoUrl || null,
        image_url: imageUrl || null,
        duration_minutes: durationMinutes,
        order,
      }).unwrap();

      dispatch(
        addNotification({
          title: "Lesson Created",
          message: `Lesson "${title}" added successfully!`,
          type: "success",
          read: false,
        })
      );

      onLessonCreated();

      // Reset form fields
      setTitle("");
      setVideoUrl("");
      setImageUrl("");
      setDurationMinutes(0);
      setOrder(1);
    } catch (err: any) {
      dispatch(
        addNotification({
          title: "Creation Failed",
          message:
            err.data?.detail || "Failed to create lesson. Please try again.",
          type: "error",
          read: false,
        })
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-xl font-bold mb-6">
          Create New Lesson for Course ID: {courseId}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="lessonTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lesson Title
            </label>
            <input
              type="text"
              id="lessonTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="videoUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Video URL (YouTube or others)
            </label>
            <input
              type="url"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., https://youtu.be/abc123XYZ"
            />
          </div>

          {/* ✅ Show YouTube preview if valid */}
          {videoUrl && extractYouTubeId(videoUrl) && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube Video Preview
              </label>
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-64 rounded-md"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(
                    videoUrl
                  )}`}
                  title="YouTube video preview"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., https://example.com/image.jpg"
            />
          </div>

          <div>
            <label
              htmlFor="durationMinutes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Duration (minutes)
            </label>
            <input
              type="number"
              id="durationMinutes"
              value={durationMinutes}
              onChange={(e) =>
                setDurationMinutes(parseInt(e.target.value) || 0)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              min="0"
              required
            />
          </div>

          <div>
            <label
              htmlFor="order"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Order in Course
            </label>
            <input
              type="number"
              id="order"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              min="1"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center">
                <PlusCircle className="w-5 h-5 mr-2" />
                Create Lesson
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
