// src/RazorpayCheckout.jsx
import React from "react";
import { useAuth } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error("Failed to load " + src));
    document.body.appendChild(s);
  });
}

export default function RazorpayCheckout({ amount, onSuccess, onError }) {
  const { token } = useAuth();

  const handlePay = async () => {
    try {
      if (!token) {
        alert("Please login first.");
        return;
      }

      const amt = Number(amount);
      if (!amt || isNaN(amt) || amt <= 0) {
        alert("Invalid amount");
        return;
      }

      // Create order on backend
      const res = await fetch(`${API_BASE}/razorpay/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: amt }) // rupees
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({ error: "Order creation failed" }));
        throw new Error(e.error || "Order creation failed");
      }

      const { orderId, razorpayKeyId } = await res.json();

      // Load SDK if not present
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      const options = {
        key: razorpayKeyId,
        amount: Math.round(amt * 100), // paise
        currency: "INR",
        name: "CIMAGE Canteen",
        description: "Food order",
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment on backend using VITE_API_URL
            const verifyRes = await fetch(`${API_BASE}/razorpay/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyJson = await verifyRes.json().catch(() => ({ error: "Verification failed" }));
            if (!verifyRes.ok) throw new Error(verifyJson.error || "Verification failed");

            if (onSuccess) onSuccess(response);
            alert("Payment successful — order placed!");
          } catch (err) {
            if (onError) onError(err);
            alert("Payment verification failed");
            console.error(err);
          }
        },
        modal: { escape: true }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        // optional: better error UX
        console.error("payment.failed", resp);
        alert("Payment failed. Please try again.");
        if (onError) onError(new Error("Payment failed"));
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert(err.message || "Payment initialization failed");
    }
  };

  return (
    <button onClick={handlePay} className="px-4 py-2 bg-amber-500 rounded">
      Pay ₹{amount}
    </button>
  );
}
