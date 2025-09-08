"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, user, loadUser, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initAttempts, setInitAttempts] = useState(0);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Load user from storage on component mount
    const initializeAuth = async () => {
      try {
        console.log("AuthProvider: Starting authentication initialization...");
        setInitAttempts((prev) => prev + 1);

        const result = await loadUser();
        console.log("AuthProvider: loadUser result:", result);

        // Check if we have a user in session storage as fallback
        const token = sessionStorage.getItem("auth_token");
        const userData = sessionStorage.getItem("user_data");

        console.log(
          "AuthProvider: Session storage check - token:",
          !!token,
          "userData:",
          !!userData
        );

        if (
          result?.type === "auth/loadUserFromStorage/fulfilled" &&
          result.payload
        ) {
          console.log("AuthProvider: Authentication restored successfully");
        } else if (token && userData) {
          console.log(
            "AuthProvider: Found stored credentials, but loadUser failed"
          );
          // Try to manually restore the state from session storage
          try {
            const parsedUser = JSON.parse(userData);
            console.log(
              "AuthProvider: Attempting to restore from session storage"
            );
            // Dispatch a manual action to restore the state
            dispatch({
              type: "auth/restoreFromStorage",
              payload: { token, user: parsedUser },
            });
          } catch (parseError) {
            console.error(
              "AuthProvider: Failed to parse stored user data:",
              parseError
            );
          }
        } else {
          console.log("AuthProvider: No stored credentials found");
        }
      } catch (error) {
        console.error(
          "AuthProvider: Failed to initialize authentication:",
          error
        );
      } finally {
        console.log("AuthProvider: Authentication initialization complete");
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [loadUser, dispatch]);

  // Debug logging
  useEffect(() => {
    console.log(
      "AuthProvider: State changed - isAuthenticated:",
      isAuthenticated,
      "user:",
      !!user,
      "loading:",
      loading
    );
  }, [isAuthenticated, user, loading]);

  // Show loading state while initializing authentication
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E1119]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00DBDC] mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing...</p>
          <p className="text-white text-sm mt-2">Attempt {initAttempts}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
