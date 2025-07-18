"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  // We'll mostly replace these with RTK Query's built-in loading/success/error states
  // but keep addCategory if it's purely local state management
  addCategory,
  // If you still need to update the local Redux slice after RTK Query success,
  // you might keep specific success actions or refetch queries that provide new data.
  // For now, let's rely on RTK Query's invalidatesTags to refetch necessary data.
  addCourseSuccess, // Keep this if you want to explicitly add the new course to the local state
  updateCourseSuccess, // Keep this if you want to explicitly update the course in the local state
  deleteCourseSuccess, // Keep this if you want to explicitly remove the course from the local state
} from "@/lib/slices/coursesSlice";
import { addNotification } from "@/lib/slices/notificationsSlice";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { X, Plus, Save, Trash2 } from "lucide-react";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCourseByIdQuery, // To fetch course data when editing
} from "@/lib/api/coursesApi"; // Import all necessary hooks

interface CourseFormProps {
  courseId?: string;
  onClose: () => void;
}

export function CourseManagement({ courseId, onClose }: CourseFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.courses); // `courses` data will now be managed more directly by RTK Query's cache
  const { user } = useAppSelector((state) => state.auth);

  // RTK Query hooks
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const { data: courseToEdit, isLoading: isLoadingCourseToEdit } =
    useGetCourseByIdQuery(Number(courseId), {
      skip: !courseId, // Skip query if no courseId is provided
    });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor_name: user?.name || "",
    duration: "",
    level: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    category: "",
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newCategory, setNewCategory] = useState("");

  // ... other state and imports

  useEffect(() => {
    if (courseId && courseToEdit) {
      setFormData({
        title: courseToEdit.title || "", // Ensure it's always a string
        description: courseToEdit.description || "", // Ensure it's always a string
        instructor_name: courseToEdit.instructor_name || "", // Ensure it's always a string
        duration: courseToEdit.duration_weeks?.toString() || "", // <-- Apply this fix here
        // Assuming duration_weeks might be a number, convert it to string.
        // If duration is already a string, just `courseToEdit.duration_weeks || ""`
        level: courseToEdit.level || "Beginner", // Provide a default if level could be null
        category: courseToEdit.category || "", // Ensure it's always a string
        image: courseToEdit.image || "", // Ensure it's always a string
      });
    } else if (!courseId) {
      // This part is already fine as it always sets defined empty strings
      setFormData({
        title: "",
        description: "",
        instructor_name: user?.name || "",
        duration: "",
        level: "Beginner",
        category: "",
        image: "",
      });
    }
  }, [courseId, courseToEdit, user?.name]); // Make sure all dependencies are correct and complete

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.instructor_name.trim())
      newErrors.instructor_name = "Instructor name is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      dispatch(addCategory(newCategory.trim()));
      setFormData((prev) => ({ ...prev, category: newCategory.trim() }));
      setNewCategory("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (courseId) {
        // Update existing course using RTK Query mutation
        const updatedCoursePayload = {
          id: Number(courseId), // Ensure ID is a number if your API expects it
          course: {
            ...formData,
            // You might need to add other properties expected by your backend
            // like progress, enrolled, rating, students, updatedAt if they are not
            // handled automatically by the backend or are required in the payload.
            // For a PUT/PATCH, often only modified fields are sent.
          },
        };

        const result = await updateCourse(updatedCoursePayload).unwrap();
        dispatch(updateCourseSuccess(result)); // Update local state if needed
        dispatch(
          addNotification({
            title: "Course Updated",
            message: `"${formData.title}" has been successfully updated`,
            type: "success",
            read: false,
          })
        );
        onClose();
      } else {
        // Create new course using RTK Query mutation
        const newCoursePayload = {
          ...formData,
          // These fields should ideally be set by the backend
          // but if your `CoursePayload` type requires them, keep them here.
          // Otherwise, remove if the backend handles default values.
          progress: 0,
          enrolled: false,
          rating: 0,
          students: 0,
          createdBy: user?.id, // Assuming user?.id is present and needed
          createdAt: new Date().toISOString(),
        };

        const result = await createCourse(newCoursePayload).unwrap();
        dispatch(addCourseSuccess(result)); // Update local state if needed
        dispatch(
          addNotification({
            title: "Course Created",
            message: `"${formData.title}" has been successfully created`,
            type: "success",
            read: false,
          })
        );
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as any)?.data?.message || "An unknown error occurred"; // More robust error handling for RTK Query errors

      dispatch(
        addNotification({
          title: "Error",
          message: errorMessage,
          type: "error",
          read: false,
        })
      );
      // Removed specific addCourseFailure/updateCourseFailure as RTK Query manages internal state.
      // You can re-add them if you have specific Redux slice logic that relies on these actions for global error states.
    }
  };

  const handleDelete = async () => {
    if (!courseId) return;

    if (
      window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      try {
        await deleteCourse(Number(courseId)).unwrap(); // Pass ID as number
        dispatch(deleteCourseSuccess(courseId)); // Update local state if needed
        dispatch(
          addNotification({
            title: "Course Deleted",
            message: `"${formData.title}" has been successfully deleted`,
            type: "success",
            read: false,
          })
        );
        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : (error as any)?.data?.message || "An unknown error occurred";
        dispatch(
          addNotification({
            title: "Error",
            message: errorMessage,
            type: "error",
            read: false,
          })
        );
        // Removed deleteCourseFailure for the same reasons as above.
      }
    }
  };

  const formLoading =
    isCreating || isUpdating || isDeleting || isLoadingCourseToEdit;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-900">
            {courseId ? "Edit Course" : "Create New Course"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoadingCourseToEdit ? (
          <div className="p-6 flex justify-center items-center h-48">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter course title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter course description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="instructor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Instructor*
                  </label>
                  <input
                    type="text"
                    id="instructor"
                    name="instructor"
                    value={formData.instructor_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                      errors.instructor ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter instructor name"
                  />
                  {errors.instructor && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.instructor}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Duration in weeks*
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                      errors.duration ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g. 8 weeks"
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.duration}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="level"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Level*
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category*
                  </label>
                  <div className="flex space-x-2">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter image URL or leave default"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              {courseId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={formLoading} // Disable during any loading state
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete Course
                </button>
              )}

              <div className="flex space-x-3 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={formLoading} // Disable during any loading state
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading} // Use combined loading state
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {courseId ? "Update Course" : "Create Course"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
