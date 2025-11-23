"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

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

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_USER_KEY = "admin_user";

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Token management functions
  const getToken = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  }, []);

  const setToken = useCallback((token: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }, []);

  const removeToken = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  }, []);

  const setStoredUser = useCallback((user: AdminUser) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  }, []);

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

        if (data.status && data.data) {
          const { token, admin } = data.data;

          // Store token and user data
          setToken(token);
          setStoredUser(admin);

          // Update state
          setAdminUser(admin);
          setIsAuthenticated(true);
          setError(null);
          setIsLoading(false);

          return { success: true };
        } else {
          const errorMessage = data.error || "Login failed";
          setError(errorMessage);
          setIsLoading(false);
          return { success: false, error: errorMessage };
        }
      } catch (error) {
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
    }

    // Clear local storage and state
    removeToken();
    setAdminUser(null);
    setIsAuthenticated(false);
    setError(null);
    setIsLoading(false);
  }, [getToken, removeToken]);

  // Check authentication on mount
  const checkAuth = useCallback(async () => {
    setIsLoading(true);

    const token = getToken();
    if (!token) {
      setIsAuthenticated(false);
      setAdminUser(null);
      setIsLoading(false);
      return;
    }

    // Get user from localStorage first
    const storedUser = getStoredUser();
    if (storedUser) {
      setAdminUser(storedUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    }

    // Verify token in background
    try {
      const user = await verifyToken(token);
      if (user) {
        setAdminUser(user);
        setStoredUser(user);
        setIsAuthenticated(true);
        setError(null);
      } else {
        removeToken();
        setAdminUser(null);
        setIsAuthenticated(false);
        setError("Session expired. Please login again.");
      }
    } catch {
      console.error("Auth check error");
      if (!storedUser) {
        removeToken();
        setAdminUser(null);
        setIsAuthenticated(false);
      }
    }

    setIsLoading(false);
  }, [getToken, getStoredUser, verifyToken, setStoredUser, removeToken]);

  // Initialize auth on mount
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AdminAuthContextType = {
    isAuthenticated,
    adminUser,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
