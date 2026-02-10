import { supabase } from "./supabase";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// Session token stored in localStorage (instead of storing user data)
const SESSION_TOKEN_KEY = "session_token";
const SESSION_TYPE_KEY = "session_type"; // "user" or "admin"

/**
 * Create a user session in Supabase database (server-side API call)
 */
export const createUserSession = async (userId: string): Promise<string | null> => {
  try {
    const response = await fetch("/api/session/create-user-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error creating user session:", error);
      return null;
    }

    const data = await response.json();
    const sessionToken = data.sessionToken;

    // Store token in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
      localStorage.setItem(SESSION_TYPE_KEY, "user");
    }

    return sessionToken;
  } catch (err) {
    console.error("Exception creating user session:", err);
    return null;
  }
};

/**
 * Create an admin session in Supabase database (server-side API call)
 */
export const createAdminSession = async (adminId: string): Promise<string | null> => {
  try {
    console.log("Creating admin session for adminId:", adminId);
    const response = await fetch("/api/session/create-admin-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error creating admin session:", error);
      return null;
    }

    const data = await response.json();
    const sessionToken = data.sessionToken;
    console.log("Session token created:", sessionToken);

    // Store token in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
      localStorage.setItem(SESSION_TYPE_KEY, "admin");
      console.log("Session stored in localStorage");
    }

    return sessionToken;
  } catch (err) {
    console.error("Exception creating admin session:", err);
    return null;
  }
};

/**
 * Get session token from localStorage
 */
export const getSessionToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(SESSION_TOKEN_KEY);
  }
  return null;
};

/**
 * Get session type from localStorage
 */
export const getSessionType = (): "user" | "admin" | null => {
  if (typeof window !== "undefined") {
    const type = localStorage.getItem(SESSION_TYPE_KEY);
    return type === "user" || type === "admin" ? type : null;
  }
  return null;
};

/**
 * Validate user session token and get user data (SERVER-SIDE ONLY)
 */
export const validateUserSession = async (
  sessionToken: string
): Promise<User | null> => {
  try {
    // Return null if no token provided
    if (!sessionToken) {
      return null;
    }

    // Use API endpoint to validate (server-side)
    const response = await fetch("/api/session/validate-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user || null;
  } catch (err) {
    console.error("Error validating user session:", err);
    return null;
  }
};

/**
 * Validate admin session token and get admin data
 */
export const validateAdminSession = async (
  sessionToken: string
): Promise<Admin | null> => {
  try {
    // Return null if no token provided
    if (!sessionToken) {
      return null;
    }

    // Use API endpoint to validate (server-side)
    const response = await fetch("/api/session/validate-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.admin || null;
  } catch (err) {
    console.error("Error validating admin session:", err);
    return null;
  }
};

/**
 * Clear session from localStorage
 */
export const clearSession = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(SESSION_TYPE_KEY);
  }
};

/**
 * Fetch user from Supabase database using userId
 */
export const getUserFromDatabase = async (userId: string): Promise<User | null> => {
  try {
    if (!supabase) {
      console.error('Supabase client not configured');
      return null;
    }
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user from database:", error);
      return null;
    }

    return data as User;
  } catch (err) {
    console.error("Exception fetching user:", err);
    return null;
  }
};

/**
 * Fetch admin from Supabase database using adminId
 */
export const getAdminFromDatabase = async (adminId: string): Promise<Admin | null> => {
  try {
    if (!supabase) {
      console.error('Supabase client not configured');
      return null;
    }
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("id", adminId)
      .single();

    if (error) {
      console.error("Error fetching admin from database:", error);
      return null;
    }

    return data as Admin;
  } catch (err) {
    console.error("Exception fetching admin:", err);
    return null;
  }
};

/**
 * Get current user from session
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const sessionToken = getSessionToken();
  const sessionType = getSessionType();

  if (!sessionToken || sessionType !== "user") {
    return null;
  }

  return validateUserSession(sessionToken);
};

/**
 * Get current admin from session
 */
export const getCurrentAdmin = async (): Promise<Admin | null> => {
  const sessionToken = getSessionToken();
  const sessionType = getSessionType();

  if (!sessionToken || sessionType !== "admin") {
    return null;
  }

  return validateAdminSession(sessionToken);
};

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = (): boolean => {
  const sessionToken = getSessionToken();
  const sessionType = getSessionType();
  return sessionToken !== null && sessionType === "user";
};

/**
 * Check if admin is authenticated
 */
export const isAdminAuthenticated = (): boolean => {
  const sessionToken = getSessionToken();
  const sessionType = getSessionType();
  return sessionToken !== null && sessionType === "admin";
};

/**
 * Check if user is verified
 */
export const isUserVerified = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user ? user.verified : false;
};
