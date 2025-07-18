import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  image: string;
  progress: number;
  enrolled: boolean;
  rating: number;
  students: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  content?: any[];
}

interface CoursesState {
  courses: Course[];
  enrolledCourses: Course[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  enrolledCourses: [],
  categories: [
    "Leadership",
    "Data Science",
    "Business",
    "Programming",
    "Design",
    "Marketing",
  ],
  loading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    // Enrollment actions
    enrollCourse: (state, action: PayloadAction<string>) => {
      const course = state.courses.find((c) => c.id === action.payload);
      if (course && !course.enrolled) {
        course.enrolled = true;
        course.students += 1;
        course.progress = 0;
        state.enrolledCourses.push(course);
      }
    },
    unenrollCourse: (state, action: PayloadAction<string>) => {
      const course = state.courses.find((c) => c.id === action.payload);
      if (course && course.enrolled) {
        course.enrolled = false;
        course.progress = 0;
        course.students -= 1;
        state.enrolledCourses = state.enrolledCourses.filter(
          (c) => c.id !== action.payload
        );
      }
    },

    // Progress tracking
    updateCourseProgress: (
      state,
      action: PayloadAction<{ courseId: string; progress: number }>
    ) => {
      const course = state.courses.find(
        (c) => c.id === action.payload.courseId
      );
      if (course) {
        course.progress = action.payload.progress;
      }
      const enrolledCourse = state.enrolledCourses.find(
        (c) => c.id === action.payload.courseId
      );
      if (enrolledCourse) {
        enrolledCourse.progress = action.payload.progress;
      }
    },

    // Course management actions
    fetchCoursesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesSuccess: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
      state.loading = false;
    },
    fetchCoursesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create course
    addCourseStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addCourseSuccess: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
      state.loading = false;
    },
    addCourseFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update course
    updateCourseStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCourseSuccess: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex(
        (course) => course.id === action.payload.id
      );
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
      state.loading = false;
    },
    updateCourseFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete course
    deleteCourseStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteCourseSuccess: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(
        (course) => course.id !== action.payload
      );
      state.enrolledCourses = state.enrolledCourses.filter(
        (course) => course.id !== action.payload
      );
      state.loading = false;
    },
    deleteCourseFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Add category
    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },

    // Filter actions
    filterCoursesByCategory: (state, action: PayloadAction<string>) => {
      // This doesn't modify state, but would be used with a selector
    },
    filterCoursesByLevel: (state, action: PayloadAction<string>) => {
      // This doesn't modify state, but would be used with a selector
    },

    // Search action
    searchCourses: (state, action: PayloadAction<string>) => {
      // This doesn't modify state, but would be used with a selector
    },

    // Reset filters
    resetFilters: (state) => {
      // This doesn't modify state, but would be used with a selector
    },
  },
});

export const {
  enrollCourse,
  unenrollCourse,
  updateCourseProgress,
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  addCourseStart,
  addCourseSuccess,
  addCourseFailure,
  updateCourseStart,
  updateCourseSuccess,
  updateCourseFailure,
  deleteCourseStart,
  deleteCourseSuccess,
  deleteCourseFailure,
  addCategory,
  filterCoursesByCategory,
  filterCoursesByLevel,
  searchCourses,
  resetFilters,
} = coursesSlice.actions;

export default coursesSlice.reducer;
