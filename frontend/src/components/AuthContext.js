import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cinesignalClient } from "@/lib/cinesignalClient";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    // CRITICAL: If returning from OAuth callback, skip the /me check.
    // AuthCallback will exchange the session_id and establish the session first.
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    if (window.location.hash?.includes("session_id=")) {
      setLoading(false);
      return;
    }
    try {
      const currentUser = await cinesignalClient.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginWithGoogle = () => {
    window.alert("Google auth is not enabled in the Netlify-only version yet. Use local sign in for now.");
  };

  const loginWithEmail = async (email, password) => {
    const result = await cinesignalClient.login({ email, password });
    setUser(result);
    return result;
  };

  const registerWithEmail = async (email, password, name) => {
    const result = await cinesignalClient.register({ email, password, name });
    setUser(result);
    return result;
  };

  const logout = async () => {
    await cinesignalClient.logout();
    setUser(null);
  };

  const processOAuthCallback = async (sessionId) => {
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout, processOAuthCallback, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
