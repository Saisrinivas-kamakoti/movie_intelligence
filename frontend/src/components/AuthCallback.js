import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";

const AuthCallback = () => {
  const { processOAuthCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = location.hash;
    const sessionId = new URLSearchParams(hash.replace("#", "?")).get("session_id");

    if (sessionId) {
      processOAuthCallback(sessionId).then((user) => {
        if (user) {
          navigate("/", { replace: true, state: { user } });
        } else {
          navigate("/login", { replace: true });
        }
      });
    } else {
      navigate("/login", { replace: true });
    }
  }, [location, navigate, processOAuthCallback]);

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="text-white text-lg">Authenticating...</div>
    </div>
  );
};

export default AuthCallback;
