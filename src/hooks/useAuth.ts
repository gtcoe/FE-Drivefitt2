import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { RootState, AppDispatch } from "@/store";
import {
  loginUser,
  registerUser,
  checkMembership,
  logoutUser,
  loadUserFromStorage,
  clearError,
  setLoading,
  updateUser,
  updateProfile,
  fetchUserProfile,
} from "@/store/slices/authSlice";
import { UserRegistrationData, User, ProfileUpdateRequest } from "@/types/auth";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const login = useCallback(
    (userData: { user: User; token: string }) => {
      return dispatch(loginUser(userData));
    },
    [dispatch]
  );

  const register = useCallback(
    (userData: UserRegistrationData) => {
      return dispatch(registerUser(userData));
    },
    [dispatch]
  );

  const checkUserMembership = useCallback(
    (userId: number) => {
      return dispatch(checkMembership(userId));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const loadUser = useCallback(() => {
    return dispatch(loadUserFromStorage());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setAuthLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoading(loading));
    },
    [dispatch]
  );

  const updateUserData = useCallback(
    (userData: Partial<User>) => {
      dispatch(updateUser(userData));
    },
    [dispatch]
  );

  const updateUserProfile = useCallback(
    (updateData: ProfileUpdateRequest) => {
      return dispatch(updateProfile(updateData));
    },
    [dispatch]
  );

  const fetchProfile = useCallback(() => {
    return dispatch(fetchUserProfile());
  }, [dispatch]);

  return {
    ...auth,
    login,
    register,
    checkUserMembership,
    logout,
    loadUser,
    clearAuthError,
    setAuthLoading,
    updateUserData,
    updateUserProfile,
    fetchProfile,
  };
};
