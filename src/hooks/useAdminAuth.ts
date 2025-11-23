"use client";

import { useState, useEffect, useCallback } from "react";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  name: string;
  status: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  status: boolean;
  data?: {
    token: string;
    admin: AdminUser;
  };
  error?: string;
}

interface VerifyResponse {
  status: boolean;
  data?: {
    admin: AdminUser;
  };
  error?: string;
}

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_USER_KEY = "admin_user";

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Debug logging for state changes
  useEffect(() => {
    console.log("Auth state changed:", {
      isAuthenticated,
      adminUser: adminUser?.name,
      isLoading,
    });
  }, [isAuthenticated, adminUser, isLoading]);

  // Get token from localStorage
  const getToken = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  }, []);

  // Set token in localStorage
  const setToken = useCallback((token: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }, []);

  // Remove token from localStorage
  const removeToken = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  }, []);

  // Set admin user in localStorage
  const setStoredUser = useCallback((user: AdminUser) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  }, []);

  // Get admin user from localStorage
  const getStoredUser = useCallback((): AdminUser | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(ADMIN_USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }, []);

  // Verify token with API
  const verifyToken = useCallback(
    async (token: string): Promise<AdminUser | null> => {
      try {
        const response = await fetch("/api/admin-auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data: VerifyResponse = await response.json();

        if (data.status && data.data?.admin) {
          return data.data.admin;
        }
        return null;
      } catch (error) {
        console.error("Token verification error:", error);
        return null;
      }
    },
    []
  );

  // Login function
  const login = useCallback(
    async (
      credentials: LoginCredentials
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin-auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        const data: LoginResponse = await response.json();
        console.log("Login API response:", data);

        if (data.status && data.data) {
          const { token, admin } = data.data;

          // Store token and user data
          setToken(token);
          setStoredUser(admin);

          // Update state immediately
          setAdminUser(admin);
          setIsAuthenticated(true);
          setError(null);
          setIsLoading(false);

          console.log("Authentication state updated:", {
            admin,
            isAuthenticated: true,
          });

          return { success: true };
        } else {
          const errorMessage = data.error || "Login failed";
          setError(errorMessage);
          setIsLoading(false);
          return { success: false, error: errorMessage };
        }
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage = "Network error. Please try again.";
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [setToken, setStoredUser]
  );

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      const token = getToken();
      if (token) {
        // Call logout API (optional)
        await fetch("/api/admin-auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
      }
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with logout even if API call fails
    }

    // Clear local storage and state
    removeToken();
    setAdminUser(null);
    setIsAuthenticated(false);
    setError(null);
    setIsLoading(false);
  }, [getToken, removeToken]);

  // Check authentication status on mount and token change
  const checkAuth = useCallback(async () => {
    setIsLoading(true);

    const token = getToken();
    if (!token) {
      setIsAuthenticated(false);
      setAdminUser(null);
      setIsLoading(false);
      return;
    }

    // Try to get user from localStorage first
    const storedUser = getStoredUser();
    if (storedUser) {
      setAdminUser(storedUser);
      setIsAuthenticated(true);
      setIsLoading(false); // Set loading to false immediately if we have stored user
    }

    // Verify token with API in background
    try {
      const user = await verifyToken(token);
      if (user) {
        setAdminUser(user);
        setStoredUser(user);
        setIsAuthenticated(true);
        setError(null);
      } else {
        // Token is invalid, clear everything
        removeToken();
        setAdminUser(null);
        setIsAuthenticated(false);
        setError("Session expired. Please login again.");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      // If we have stored user but API fails, keep them logged in temporarily
      if (!storedUser) {
        removeToken();
        setAdminUser(null);
        setIsAuthenticated(false);
      }
    }

    setIsLoading(false);
  }, [getToken, getStoredUser, verifyToken, setStoredUser, removeToken]);

  // Check auth on mount only once
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove checkAuth dependency to prevent re-runs

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    isAuthenticated,
    adminUser,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    clearError: () => setError(null),
  };
};
