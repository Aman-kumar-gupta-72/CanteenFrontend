import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import initReveal from "./reveal";

setTimeout(() => initReveal(), 80);

import MenuPage from "./pages/MenuPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const API = "http://localhost:5000/api";
const STORAGE = {
  ITEMS: "cimage_items_v1",
  CART: "cimage_cart_v1",
  TOKEN: "cimage_token_v1"
};

const sample = [
  { _id: "1", name: "Greek Salad", price: 19, category: "Starters", desc: "Crisp greens, feta, olives.", img: "https://images.unsplash.com/photo-1543353071-087092ec3935?q=80&w=1400" },
  { _id: "2", name: "Tokusen Wagyu", price: 45, category: "Mains", desc: "Premium wagyu slices.", img: "https://images.unsplash.com/photo-1606756792989-7a7f7b95b3a8?q=80&w=1400" },
  { _id: "3", name: "Butternut Pumpkin", price: 15, category: "Soups", desc: "Velvety pumpkin soup.", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400" },
  { _id: "4", name: "Opu Fish", price: 12, category: "Mains", desc: "Delicate pan-seared fish.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400" }
];

function currency(n) { return `₹${Number(n).toFixed(0)}`; }

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

export default function App() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE.TOKEN) || "");
  const [userRole, setUserRole] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState(null);

  // Function to reload items from API
  const reloadItems = async () => {
    console.log('Reloading items from API...');
    try {
      const response = await fetch(`${API}/items`);
      if (response.ok) {
        const data = await response.json();
        console.log('Items reloaded from API:', data);
        if (Array.isArray(data)) {
          setItems(data.length > 0 ? data : sample);
          localStorage.setItem(STORAGE.ITEMS, JSON.stringify(data.length > 0 ? data : sample));
        }
      }
    } catch (error) {
      console.error('Failed to reload items:', error);
    }
  };

  // Load items from API and cart from localStorage
  useEffect(() => {
    const loadMenuItems = async () => {
      console.log('Loading menu items...');
      try {
        const response = await fetch(`${API}/items`);
        console.log('API response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Items from API:', data);
          if (Array.isArray(data)) {
            if (data.length > 0) {
              setItems(data);
              localStorage.setItem(STORAGE.ITEMS, JSON.stringify(data));
              return;
            } else {
              // API returned empty array, use fallback
              console.log('API returned empty array, using fallback');
            }
          }
        }
      } catch (error) {
        console.error('Failed to load menu items from API:', error);
      }
      
      // Fallback to localStorage or sample data
      console.log('Using fallback data...');
      let parsedItems = null;
      try { 
        parsedItems = JSON.parse(localStorage.getItem(STORAGE.ITEMS)); 
        console.log('Items from localStorage:', parsedItems);
      } catch { parsedItems = null; }
      
      if (!parsedItems || !Array.isArray(parsedItems) || parsedItems.length === 0) {
        console.log('Using sample data');
        parsedItems = sample;
      }
      console.log('Final items to be set:', parsedItems);
      setItems(parsedItems);
    };

    loadMenuItems();

    // Load cart from localStorage and validate it
    try {
      const rawCart = JSON.parse(localStorage.getItem(STORAGE.CART));
      if (rawCart && typeof rawCart === "object") {
        console.log('Loaded cart from localStorage:', rawCart);
        setCart(rawCart);
      }
    } catch { /* ignore */ }

    // Extract user role from stored token
    if (token) {
      const decoded = decodeJwt(token);
      setUserRole(decoded?.role || null);
      console.log('User role loaded from token:', decoded?.role);
    }
  }, []);

  // persist cart and items where appropriate
  useEffect(() => {
    try { localStorage.setItem(STORAGE.CART, JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    if (token) localStorage.setItem(STORAGE.TOKEN, token); else localStorage.removeItem(STORAGE.TOKEN);
  }, [token]);

  function flash(t) { setMsg(t); setTimeout(() => setMsg(null), 2000); }

  // Add to cart (shared)
  const addToCart = (id) => {
    console.log('Adding to cart, itemId:', id, 'Current cart:', cart);
    setCart(c => {
      const updated = { ...c, [id]: (c[id] || 0) + 1 };
      console.log('Updated cart:', updated);
      return updated;
    });
    flash("Added to cart");
  };

  const changeQty = (id, qty) => {
    if (qty <= 0) {
      const n = { ...cart }; delete n[id]; setCart(n); return;
    }
    setCart(c => ({ ...c, [id]: qty }));
  };

  const clearCart = () => setCart({});

  const categories = ["All", ...Array.from(new Set(items.map(i => i.category)))];

  const visible = items.filter(it => {
    const q = query.trim().toLowerCase();
    const matchesQuery = q === "" || it.name.toLowerCase().includes(q) || (it.desc || "").toLowerCase().includes(q);
    const matchesCat = category === "All" || it.category === category;
    return matchesQuery && matchesCat;
  });

  const cartItems = Object.keys(cart).map(id => {
    const it = items.find(x => String(x._id) === String(id));
    console.log('Looking for item with id:', id, 'Found:', it);
    return it ? { ...it, qty: cart[id] } : null;
  }).filter(Boolean);
  const subtotal = cartItems.reduce((s, it) => s + it.price * it.qty, 0);
  console.log('CartItems:', cartItems, 'Subtotal:', subtotal);

  // AUTH
  async function submitAuth(mode = "login") {
    try {
      if (!authForm.email || !authForm.password) { flash("fill fields"); return; }
      const url = `${API}/users/${mode}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authForm.email, password: authForm.password, name: authForm.email })
      });
      const data = await res.json().catch(()=>({ error: "Server error" }));
      if (!res.ok) return flash(data.error || "Auth failed");
      if (mode === "login") {
        setToken(data.token);
        const decoded = decodeJwt(data.token);
        setUserRole(decoded?.role || null);
        console.log('User logged in with role:', decoded?.role);
        setLoginOpen(false);
        flash("Logged in");
      } else {
        flash("Registered — please login");
      }
    } catch (e) { console.error(e); flash("Network error"); }
  }

  // Checkout -> create Razorpay order on server, open Razorpay checkout
  async function checkout() {
    console.log('Token:', token);
    console.log('CartItems:', cartItems);
    console.log('Subtotal:', subtotal);
    
    if (!token) { 
      flash("Please login first");
      navigate("/login");
      return; 
    }
    if (cartItems.length === 0) { flash("Cart empty"); return; }

    const amount = subtotal;
    console.log('Starting checkout with amount:', amount);

    try {
      console.log('Calling API:', `${API}/razorpay/order`);
      const res = await fetch(`${API}/razorpay/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount })
      });
      console.log('Response status:', res.status);
      const data = await res.json().catch(()=>({ error: "Order creation failed" }));
      console.log('Response data:', data);
      if (!res.ok) {
        console.error('API error:', data.error);
        return flash(data.error || "Order creation failed");
      }

      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://checkout.razorpay.com/v1/checkout.js";
          s.onload = resolve;
          s.onerror = reject;
          document.body.appendChild(s);
        });
      }

      const options = {
        key: data.razorpayKeyId,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "CIMAGE Canteen",
        description: `Order ${data.orderId}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API}/razorpay/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyJson.error || "Verification failed");
            flash("Payment successful — order placed");
            setCart({});
          } catch (err) {
            console.error(err);
            flash("Payment verification failed");
          }
        },
        prefill: { name: authForm.email || "" },
        theme: { color: "#F59E0B" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) { console.error("payment.failed", resp); flash("Payment failed"); });
      rzp.open();
    } catch (e) {
      console.error(e);
      flash("Checkout error");
    }
  }

  const logout = () => { 
    setToken(""); 
    setUserRole(null);
    localStorage.removeItem(STORAGE.TOKEN); 
    flash("Logged out"); 
  };

  return (
    <div className="min-h-screen text-gray-200 antialiased bg-[#06080a]">
      <Routes>
        <Route path="/" element={
          <>
            <header className="w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg text-2xl">🍽️</div>
          <div>
            <div className="font-serif text-2xl tracking-wide text-amber-400">CIMAGE</div>
            <div className="text-xs text-gray-400">Canteen & Kitchen</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-[#0f1724] px-3 py-2 rounded-full border border-[#1f2937]">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search menu" className="bg-transparent outline-none placeholder:text-gray-500 w-48" />
            <select value={category} onChange={e => setCategory(e.target.value)} className="bg-transparent outline-none">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {!token && (
            <>
              <button onClick={() => navigate("/login")} className="px-4 py-2 rounded-full border border-[#2b3440] hover:bg-[#0f1724] transition">Login</button>
              <button onClick={() => navigate("/register")} className="px-4 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-500 transition">Register</button>
            </>
          )}
          {token && (
            <>
              <button onClick={() => navigate("/account")} className="px-4 py-2 rounded-full border border-[#2b3440] hover:bg-[#0f1724] transition">Account</button>
              <button onClick={logout} className="px-4 py-2 rounded-full border border-[#2b3440] hover:bg-[#0f1724] transition">Logout</button>
              {userRole === "admin" && <button onClick={() => navigate("/admin")} className="px-4 py-2 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-500">Admin</button>}
            </>
          )}
          <button onClick={() => document.getElementById("cart-panel")?.classList.toggle("hidden")} className="px-4 py-2 rounded-full bg-amber-500 text-black font-semibold">
            Cart ({Object.values(cart).reduce((s, v) => s + v, 0)})
          </button>
        </div>
      </header>

      {/* MENU: replaced with MenuPage (shared items + addToCart passed in) */}
      <section className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4">
          <MenuPage items={items} onAdd={addToCart} />
        </div>
      </section>

      {/* CART PANEL */}
      <aside id="cart-panel" className="hidden fixed right-4 top-28 w-96 max-w-[calc(100vw-32px)] bg-[#071018] border border-[#12202b] p-4 rounded-2xl shadow-2xl z-50 md:w-96">
        <h3 className="font-semibold text-lg">Your Order</h3>
        <div className="mt-3 space-y-3 max-h-64 overflow-auto">
          {cartItems.length === 0 && <div className="text-gray-500">Cart is empty</div>}
          {cartItems.map(ci => (
            <div key={ci._id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{ci.name}</div>
                <div className="text-sm text-gray-400">{currency(ci.price)}</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min={0} value={ci.qty} onChange={e => changeQty(ci._id, Number(e.target.value) || 0)} className="w-16 px-2 py-1 rounded bg-[#0b1220] border border-[#1f2937]" />
                <div className="w-20 text-right">{currency(ci.price * ci.qty)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-[#12202b] pt-3">
          <div className="flex items-center justify-between text-gray-300">
            <div>Subtotal</div>
            <div className="font-semibold">{currency(subtotal)}</div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={checkout} className="flex-1 px-3 py-2 rounded-full bg-amber-500 text-black font-semibold">Pay Now</button>
            <button onClick={clearCart} className="px-3 py-2 rounded-full border">Clear</button>
          </div>
        </div>
      </aside>

      {/* LOGIN MODAL */}
      {loginOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#071018] rounded-2xl p-6 w-full max-w-md border border-[#12202b]">
            <h4 className="font-semibold mb-2">Student Login / Register</h4>
            <input placeholder="Email" value={authForm.email} onChange={e => setAuthForm(f => ({...f, email: e.target.value}))} className="w-full px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] mb-2" />
            <input type="password" placeholder="Password" value={authForm.password} onChange={e => setAuthForm(f => ({...f, password: e.target.value}))} className="w-full px-3 py-2 rounded bg-[#0b1220] border border-[#1f2937] mb-4" />
            <div className="flex gap-2">
              <button onClick={() => submitAuth("login")} className="flex-1 px-3 py-2 rounded bg-amber-500 text-black">Login</button>
              <button onClick={() => submitAuth("register")} className="flex-1 px-3 py-2 rounded border">Register</button>
            </div>
            <div className="mt-3 text-sm text-gray-400">You can use college ID and password. Tokens are stored locally.</div>
            <div className="mt-4 text-right">
              <button onClick={() => setLoginOpen(false)} className="text-gray-400">Close</button>
            </div>
          </div>
        </div>
      )}

            {msg && <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full z-50">{msg}</div>}

            <footer className="w-full px-6 py-8 text-gray-500 text-sm">© CIMAGE Canteen — Designed with ❤️</footer>
          </>
        } />
        <Route path="/login" element={<LoginPage onLogin={(token, role) => { setToken(token); setUserRole(role); }} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage items={items} setItems={setItems} token={token} userRole={userRole} onItemsChange={reloadItems} />} />
      </Routes>
    </div>
  );
} 