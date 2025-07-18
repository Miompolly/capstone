import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/api";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Cookie helper functions
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  }
};

const getCookie = (name: string): string | null => {
  if (typeof document !== "undefined") {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

const deleteCookie = (name: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; access: string; refresh: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Store in cookies
      setCookie("token", action.payload.access, 7);
      setCookie("refreshToken", action.payload.refresh, 30);
      setCookie("user", JSON.stringify(action.payload.user), 7);
      setCookie("userRole", action.payload.user.role, 7);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear cookies
      deleteCookie("token");
      deleteCookie("refreshToken");
      deleteCookie("user");
      deleteCookie("userRole");
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        setCookie("user", JSON.stringify(state.user), 7);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = getCookie("token");
      const refreshToken = getCookie("refreshToken");
      const userStr = getCookie("user");

      if (token && refreshToken && userStr) {
        try {
          state.token = token;
          state.refreshToken = refreshToken;
          state.user = JSON.parse(userStr);
          state.isAuthenticated = true;
        } catch (error) {
          // If parsing fails, clear cookies
          deleteCookie("token");
          deleteCookie("refreshToken");
          deleteCookie("user");
          deleteCookie("userRole");
        }
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  clearError,
  initializeAuth,
} = authSlice.actions;
export default authSlice.reducer;
