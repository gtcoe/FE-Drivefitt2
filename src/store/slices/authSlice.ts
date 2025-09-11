import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  User,
  UserRegistrationData,
  ProfileUpdateRequest,
} from "@/types/auth";
import { authService } from "@/services/authService";

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData: { user: User; token: string }, { rejectWithValue }) => {
    try {
      // Return the user data and token directly
      return {
        success: true,
        data: {
          user: userData.user,
          token: userData.token,
        },
      };
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: UserRegistrationData, { rejectWithValue }) => {
    try {
      const response = await authService.registerUser(userData);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  }
);

export const checkMembership = createAsyncThunk(
  "auth/checkMembership",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await authService.checkUserMembership(userId);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to check membership"
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await authService.getUserProfile();
      return userData;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch user profile"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Logout failed"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (updateData: ProfileUpdateRequest, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(updateData);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };

      // Prevent multiple simultaneous calls
      if (state.auth.loading) {
        console.log("loadUserFromStorage: Already loading, skipping...");
        return null;
      }

      // If already authenticated with user data, don't reload
      if (state.auth.isAuthenticated && state.auth.user) {
        console.log("loadUserFromStorage: Already authenticated, skipping...");
        return { token: state.auth.token, user: state.auth.user };
      }

      const token = sessionStorage.getItem("auth_token");
      const userData = sessionStorage.getItem("user_data");

      console.log("loadUserFromStorage: token exists:", !!token);
      console.log("loadUserFromStorage: userData exists:", !!userData);

      if (!token || !userData) {
        console.log("loadUserFromStorage: No token or user data found");
        return null;
      }

      try {
        const storedUser = JSON.parse(userData);

        // First, try to verify the token
        console.log("loadUserFromStorage: Verifying token...");
        const isValid = await authService.verifyToken(token);
        console.log("loadUserFromStorage: Token valid:", isValid);

        if (!isValid) {
          console.log("loadUserFromStorage: Token invalid, clearing storage");
          sessionStorage.removeItem("auth_token");
          sessionStorage.removeItem("user_data");
          return null;
        }

        // Token is valid, try to get fresh user data
        console.log(
          "loadUserFromStorage: Fetching fresh user data from backend"
        );
        try {
          const freshUserData = await authService.getUserProfile();
          if (freshUserData) {
            console.log(
              "loadUserFromStorage: Fresh user data fetched successfully"
            );
            // Update session storage with fresh data
            sessionStorage.setItem("user_data", JSON.stringify(freshUserData));
            return { token, user: freshUserData };
          }
        } catch (profileError) {
          console.warn(
            "loadUserFromStorage: Failed to fetch fresh profile, using stored data:",
            profileError
          );
          // If we can't fetch fresh data but token is valid, use stored data
          return { token, user: storedUser };
        }

        // If we reach here, something went wrong
        console.error(
          "loadUserFromStorage: Unexpected error in profile fetching"
        );
        return null;
      } catch (parseError) {
        console.error(
          "loadUserFromStorage: Error parsing stored user data:",
          parseError
        );
        // Clear corrupted data
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("user_data");
        return null;
      }
    } catch (error: unknown) {
      console.error("loadUserFromStorage: Unexpected error:", error);
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to load user from storage"
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update session storage
        sessionStorage.setItem("user_data", JSON.stringify(state.user));
      }
    },
    restoreFromStorage: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      console.log("Auth slice: State restored from storage manually");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.data) {
          state.isAuthenticated = true;
          state.user = action.payload.data.user;
          state.token = action.payload.data.token;
          state.error = null;

          // Store in session storage
          sessionStorage.setItem("auth_token", action.payload.data.token);
          sessionStorage.setItem(
            "user_data",
            JSON.stringify(action.payload.data.user)
          );
        } else {
          state.error = "Login failed";
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.data) {
          state.isAuthenticated = true;
          state.user = action.payload.data.user;
          state.token = action.payload.data.token;
          state.error = null;

          // Store in session storage
          sessionStorage.setItem("auth_token", action.payload.data.token);
          sessionStorage.setItem(
            "user_data",
            JSON.stringify(action.payload.data.user)
          );
        } else {
          state.error = action.payload.message || "Registration failed";
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Check membership
      .addCase(checkMembership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkMembership.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user && action.payload) {
          state.user.hasMembership = action.payload.hasMembership;
          state.user.membershipInfo = action.payload.membershipInfo;
          // Add support for multiple memberships
          state.user.memberships = action.payload.memberships;

          // Update session storage
          sessionStorage.setItem("user_data", JSON.stringify(state.user));
        }
      })
      .addCase(checkMembership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout user
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;

        // Clear session storage
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("user_data");
      })

      // Load user from storage
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.loading = false;
          state.error = null;
        } else {
          // Only set isAuthenticated to false if we don't already have a user
          // This prevents race conditions during token verification
          if (!state.user) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
          }
          state.loading = false;
          state.error = null;
        }
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update profile (no global loading state)
      .addCase(updateProfile.pending, (state) => {
        // Don't set global loading state for profile updates
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.user = action.payload.data.user;
          state.error = null;
        } else {
          state.error = action.payload.message || "Profile update failed";
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;

        // Update session storage
        sessionStorage.setItem("user_data", JSON.stringify(action.payload));
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setLoading, updateUser, restoreFromStorage } =
  authSlice.actions;
export default authSlice.reducer;
