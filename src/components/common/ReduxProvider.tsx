"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { AuthProvider } from "./AuthProvider";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
