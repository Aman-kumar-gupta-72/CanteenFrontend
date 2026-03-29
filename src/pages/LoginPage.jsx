import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:5000/api";

function decodeJwt(token) {
  try {
    if (!token) return null;
    const payload = token.split(".")[1];
    const fixed = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=");
    return JSON.parse(atob(fixed.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token
      localStorage.setItem("cimage_token_v1", data.token);

      // Decode token to get role
      const decoded = decodeJwt(data.token);
      console.log("✅ Login successful! Role:", decoded?.role);

      setMessage("✅ Login successful! Redirecting...");

      // Call parent callback
      if (typeof onLogin === "function") {
        onLogin(data.token, decoded?.role);
      }

      // Redirect based on role
      setTimeout(() => {
        if (decoded?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050607] to-[#0f1724] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg text-4xl mx-auto mb-4">
            🍽️
          </div>
          <h1 className="text-4xl font-bold text-amber-400 font-serif">CIMAGE</h1>
          <p className="text-gray-400 mt-1">Canteen & Kitchen</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#071018] border border-[#12202b] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Student Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg bg-[#0b1220] border border-[#1f2937] text-white placeholder:text-gray-600 outline-none focus:border-amber-500 transition"
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-[#0b1220] border border-[#1f2937] text-white placeholder:text-gray-600 outline-none focus:border-amber-500 transition"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="p-3 rounded-lg bg-green-900/30 border border-green-700 text-green-400 text-sm">
                {message}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 text-black font-bold transition duration-200 mt-6"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[#1f2937]"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-[#1f2937]"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-amber-400 hover:text-amber-300 font-semibold transition"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 rounded-lg bg-[#071018] border border-[#1f2937] text-sm text-gray-400">
          <p className="font-semibold text-gray-300 mb-2">📝 Demo Credentials:</p>
          <p>• Email: admin@canteen.com</p>
          <p>• Password: (from registration)</p>
          <p className="mt-2 text-gray-500">First registered user becomes admin automatically.</p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-300 text-sm transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
