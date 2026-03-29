import React, { useState } from "react";

const API_BASE = "http://localhost:5000/api";

export default function AdminRegister({ token, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, Email, and Password are required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users/register-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's an authorization error
        if (response.status === 403) {
          throw new Error("❌ Access Denied! Only admins can register new admins.");
        }
        throw new Error(data.error || "Failed to register admin");
      }

      setMessage("✅ Admin registered successfully!");
      setFormData({ name: "", email: "", password: "", phone: "" });

      // Call success callback
      if (typeof onSuccess === "function") {
        onSuccess(data.user);
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        if (typeof onClose === "function") {
          onClose();
        }
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#071018] rounded-2xl p-6 w-full max-w-md border border-[#12202b]">
      <h3 className="font-semibold text-lg mb-4">Register New Admin</h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-400">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter admin name"
            className="w-full px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] outline-none text-white placeholder:text-gray-600"
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-400">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@canteen.com"
            className="w-full px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] outline-none text-white placeholder:text-gray-600"
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-400">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 6 characters"
            className="w-full px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] outline-none text-white placeholder:text-gray-600"
            disabled={loading}
          />
        </div>

        {/* Phone (Optional) */}
        <div>
          <label className="text-sm text-gray-400">Phone (Optional)</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] outline-none text-white placeholder:text-gray-600"
            disabled={loading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded bg-red-900/30 border border-red-700 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="p-3 rounded bg-green-900/30 border border-green-700 text-green-400 text-sm">
            {message}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-3 py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register Admin"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3 py-2 rounded border border-[#2b3440] text-gray-400 hover:bg-[#0f1724] disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="mt-4 text-xs text-gray-500 border-t border-[#1f2937] pt-3">
        <p>• Admin can manage menu items and other admins</p>
        <p>• All fields are case-sensitive</p>
        <p>• Email must be unique</p>
      </div>
    </div>
  );
}
