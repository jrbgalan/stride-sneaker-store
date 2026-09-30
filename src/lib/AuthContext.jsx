"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '@/lib/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState({
    id: "axis-store",
    public_settings: {
      store_name: "AXIS SNEAKERS",
      currency: "USD",
      support_email: "support@axis.com",
    },
  });

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await db.auth.me();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const checkAppState = async () => {
    setIsLoadingPublicSettings(false);
    await checkUserAuth();
  };

  useEffect(() => {
    checkAppState();
  }, []);

  const login = async ({ email, password }) => {
    setIsLoadingAuth(true);
    try {
      const loggedUser = await db.auth.login({ email, password });
      setUser(loggedUser);
      setIsAuthenticated(true);
      return loggedUser;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const register = async ({ email, password, name }) => {
    setIsLoadingAuth(true);
    try {
      const newUser = await db.auth.register({ email, password, name });
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async () => {
    await db.auth.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        login,
        register,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
