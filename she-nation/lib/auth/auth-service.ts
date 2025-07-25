import { dummyUsers, getUserByEmail } from "@/lib/data/dummy-users";

// Token utility functions
export const getCookie = (name: string): string | null => {
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

export const getAuthToken = (): string | null => {
  return getCookie("token");
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
}

export const authenticateUser = async (
  credentials: LoginCredentials
): Promise<AuthResult> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = getUserByEmail(credentials.email);

  if (!user) {
    return {
      success: false,
      error: "User not found. Please check your email address.",
    };
  }

  if (user.password !== credentials.password) {
    return {
      success: false,
      error: "Invalid password. Please try again.",
    };
  }

  // Remove password from user object before returning
  const { password, ...userWithoutPassword } = user;

  return {
    success: true,
    user: userWithoutPassword,
  };
};

export const registerUser = async (userData: any): Promise<AuthResult> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if user already exists
  const existingUser = getUserByEmail(userData.email);

  if (existingUser) {
    return {
      success: false,
      error: "An account with this email already exists.",
    };
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    avatar: "/placeholder.svg?height=100&width=100",
    skills: [],
    achievements: [],
    joinedDate: new Date().toISOString().split("T")[0],
  };

  // Add to dummy users (in real app, this would be saved to database)
  dummyUsers.push(newUser);

  // Remove password from user object before returning
  const { password, ...userWithoutPassword } = newUser;

  return {
    success: true,
    user: userWithoutPassword,
  };
};

export const hasPermission = (
  userRole: string,
  requiredRoles: string[]
): boolean => {
  return requiredRoles.includes(userRole);
};

export const canAccessResource = (
  userRole: string,
  resource: string
): boolean => {
  const permissions = {
    admin: [
      "dashboard",
      "users",
      "courses",
      "jobs",
      "mentorship",
      "forum",
      "analytics",
      "settings",
    ],
    mentor: ["dashboard", "mentorship", "courses", "forum", "profile"],
    lecturer: [
      "dashboard",
      "courses",
      "students",
      "forum",
      "profile",
      "analytics",
    ],
    company: ["dashboard", "jobs", "candidates", "profile", "analytics"],
    mentee: ["dashboard", "courses", "mentorship", "jobs", "forum", "profile"],
  };

  return (
    permissions[userRole as keyof typeof permissions]?.includes(resource) ||
    false
  );
};
