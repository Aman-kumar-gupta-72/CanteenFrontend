// src/Login.jsx
import React, { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Login({ onDone }) {
  const { login, register } = useAuth();
  const [collegeId, setCollegeId] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ college_id: collegeId, password });
      } else {
        await register({ college_id: collegeId, password });
        // automatically login after register
        await login({ college_id: collegeId, password });
      }
      if (onDone) onDone();
    } catch (err) {
      setError(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white/5 backdrop-blur p-6 rounded shadow-lg">
      <h2 className="text-2xl mb-4">{mode === "login" ? "Student Login" : "Register"}</h2>
      {error && <div className="mb-3 text-red-300">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm">College ID</label>
          <input
            value={collegeId}
            onChange={(e) => setCollegeId(e.target.value)}
            required
            className="w-full px-3 py-2 rounded text-black"
            placeholder="e.g. S12345"
          />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            className="w-full px-3 py-2 rounded text-black"
            placeholder="password"
          />
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-amber-500 rounded">
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="underline text-sm"
          >
            {mode === "login" ? "Create account" : "Have an account? Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
