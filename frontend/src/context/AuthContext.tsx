import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, setUnauthorizedHandler } from "../services/apiClient";
import type { AdminUser } from "../services/apiClient";

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await api.getCurrentUser();
      const currentUser = response.user || (response.data as any)?.user;
      if (currentUser && currentUser.role === "ADMIN" && (currentUser.status === "ACTIVE" || !currentUser.status)) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch {
      // 401 or network error - user is not authenticated
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Register global unauthorized handler to clear in-memory state
    setUnauthorizedHandler(() => {
      setUser(null);
    });

    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: { email: string; password: string }) => {
    const response = await api.login(credentials);
    const loggedUser = response.user || (response.data as any)?.user;
    if (loggedUser && loggedUser.role === "ADMIN") {
      setUser(loggedUser);
    } else {
      setUser(null);
      throw new Error("Access restricted: Administrator role required.");
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = Boolean(user && user.role === "ADMIN" && (user.status === "ACTIVE" || !user.status));

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshAuth: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
