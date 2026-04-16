import React, { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { Mail, Lock, User, LogIn } from "lucide-react";

const LoginPage = () => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await registerWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4" data-testid="login-page">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
            <span className="text-white font-bold text-2xl">CS</span>
          </div>
          <h1 className="text-3xl font-black text-white">CineSignal</h1>
          <p className="text-slate-500 text-sm mt-1">Film Demand Intelligence Platform</p>
        </div>

        <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/50 p-8">
          <h2 className="text-xl font-bold text-white mb-6">{isRegister ? "Create Account" : "Sign In"}</h2>

          {/* Google Auth */}
          <button
            onClick={loginWithGoogle}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl flex items-center justify-center gap-3 transition-all mb-4"
            data-testid="google-login-button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-slate-500 text-xs">or</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative">
                <User size={16} className="absolute left-3 top-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  data-testid="register-name"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3.5 text-slate-500" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                data-testid="login-email"
                required
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3.5 text-slate-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                data-testid="login-password"
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-xs bg-red-900/20 border border-red-500/30 rounded-lg p-3" data-testid="auth-error">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              data-testid="auth-submit"
            >
              <LogIn size={16} /> {loading ? "..." : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(""); }}
              className="text-amber-400 hover:text-amber-300 text-sm transition-all"
              data-testid="toggle-auth-mode"
            >
              {isRegister ? "Already have an account? Sign In" : "Need an account? Register"}
            </button>
          </div>

          {/* Guest mode */}
          <div className="mt-4 text-center">
            <a href="/" className="text-slate-500 hover:text-slate-400 text-xs transition-all" data-testid="continue-guest">
              Continue as guest (limited features)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
