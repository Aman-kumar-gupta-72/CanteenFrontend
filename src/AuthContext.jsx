import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * AuthContext
 * - Uses VITE_API_URL for backend base (set in .env: VITE_API_URL=http://localhost:5000)
 * - Exposes login, register, logout, createOrder, verifyPayment, getMyOrders
 */

const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem("user");
    if (s) return JSON.parse(s);
    const t = localStorage.getItem("token");
    if (t) {
      const p = decodeJwt(t);
      return p ? { id: p.id, college_id: p.college_id } : null;
    }
    return null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("token", token); else localStorage.removeItem("token");
    if (token) {
      const p = decodeJwt(token);
      if (p) setUser({ id: p.id, college_id: p.college_id });
    }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user)); else localStorage.removeItem("user");
  }, [user]);

  // --- helper that attaches auth header and handles JSON errors ---
  async function fetchWithAuth(path, opts = {}) {
    const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch((API_BASE || "") + path, { ...opts, headers });
    const text = await res.text().catch(() => "");
    let json = {};
    try { json = text ? JSON.parse(text) : {}; } catch { json = { error: text } }

    if (!res.ok) {
      const errMsg = json && json.error ? json.error : `Request failed: ${res.status}`;
      const err = new Error(errMsg);
      err.status = res.status;
      err.body = json;
      throw err;
    }
    return json;
  }

  // --- auth operations ---
  const login = async ({ college_id, password }) => {
    const json = await fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify({ college_id, password })
    });

    if (json.token) {
      setToken(json.token);
      const p = decodeJwt(json.token);
      setUser(p ? { id: p.id, college_id: p.college_id } : { college_id });
    }
    return json;
  };

  const register = async ({ college_id, password, name, email, phone }) => {
    const json = await fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify({ college_id, password, name, email, phone })
    });

    if (json.token) {
      setToken(json.token);
      const p = decodeJwt(json.token);
      setUser(p ? { id: p.id, college_id: p.college_id } : { college_id });
    }
    return json;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // --- razorpay / orders ---
  // amount is a number in rupees (e.g. 50) — backend will convert *100
  const createOrder = async (amount) => {
    if (typeof amount !== "number") throw new Error("amount must be a number (rupees)");
    return await fetchWithAuth("/api/razorpay/order", {
      method: "POST",
      body: JSON.stringify({ amount })
    });
  };

  // payload should include razorpay_order_id, razorpay_payment_id, razorpay_signature
  const verifyPayment = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    return await fetchWithAuth("/api/razorpay/verify", {
      method: "POST",
      body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
    });
  };

  const getMyOrders = async () => {
    return await fetchWithAuth("/api/orders/me", { method: "GET" });
  };

  return (
    <AuthContext.Provider value={{
      token, user,
      login, register, logout,
      createOrder, verifyPayment, getMyOrders,
      fetchWithAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
