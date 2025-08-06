import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authSlice from "./slices/authSlice";
import notificationsSlice from "./slices/notificationsSlice";
import coursesSlice from "./slices/coursesSlice";
import jobsSlice from "./slices/jobsSlice";
import mentorshipSlice from "./slices/mentorshipSlice";
import forumSlice from "./slices/forumSlice";
import { analyticsApi } from "./slices/analyticsApiSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authSlice,
    notifications: notificationsSlice,
    courses: coursesSlice,
    jobs: jobsSlice,
    mentorship: mentorshipSlice,
    forum: forumSlice,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(analyticsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
