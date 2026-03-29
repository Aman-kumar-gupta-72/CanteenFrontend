// src/pages/MenuPage.jsx
import React, { useEffect, useState } from "react";
import MenuGrid from "../components/MenuGrid";
import FadeIn from "../components/FadeIn";

import Typing from "../components/Typing";
import StickyScroll from "../components/StickyScroll";

/* SAMPLE_MENU kept unchanged (truncated here for brevity in this view)
   — use your existing SAMPLE_MENU from your file (I keep it identical). */
const SAMPLE_MENU = [
  { _id: "101", name: "Aloo Paratha", price: 60, category: "Breakfast", desc: "Stuffed potato paratha with butter.", img: "https://images.pexels.com/photos/33428723/pexels-photo-33428723.jpeg" },
  { _id: "102", name: "Masala Dosa", price: 80, category: "Breakfast", desc: "Crispy dosa with potato masala.", img: "https://images.pexels.com/photos/20422138/pexels-photo-20422138.jpeg" },
  { _id: "103", name: "Poha", price: 45, category: "Breakfast", desc: "Flattened rice with peanuts & spices.", img: "https://images.pexels.com/photos/20408460/pexels-photo-20408460.jpeg" },

  { _id: "201", name: "Paneer Butter Masala", price: 180, category: "Mains", desc: "Creamy tomato gravy with paneer.", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800" },
  { _id: "202", name: "Chole Bhature", price: 140, category: "Mains", desc: "Spicy chole with fluffy bhature.", img: "https://images.pexels.com/photos/11818239/pexels-photo-11818239.jpeg" },
  { _id: "203", name: "Dal Tadka", price: 120, category: "Mains", desc: "Yellow dal tempered with ghee.", img: "https://images.pexels.com/photos/28674561/pexels-photo-28674561.jpeg" },

  { _id: "301", name: "Veg Biryani", price: 160, category: "Rice", desc: "Vegetable biryani with basmati rice.", img: "https://images.pexels.com/photos/9609848/pexels-photo-9609848.jpeg" },
  { _id: "302", name: "Jeera Rice", price: 90, category: "Rice", desc: "Basmati rice tempered with cumin.", img: "https://images.pexels.com/photos/35267286/pexels-photo-35267286.jpeg" },

  { _id: "401", name: "Samosa (2 pcs)", price: 50, category: "Snacks", desc: "Crispy potato stuffed samosa.", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800" },
  { _id: "402", name: "Paneer Tikka", price: 150, category: "Starters", desc: "Char-grilled paneer cubes.", img: "https://images.pexels.com/photos/33430558/pexels-photo-33430558.jpeg" },

  { _id: "501", name: "Gulab Jamun", price: 60, category: "Dessert", desc: "Milk dumplings soaked in sugar syrup.", img: "https://images.pexels.com/photos/14610769/pexels-photo-14610769.jpeg" },
  { _id: "502", name: "Masala Chai", price: 20, category: "Beverages", desc: "Traditional Indian spiced tea.", img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80" },

  { _id: "601", name: "Veg Momos", price: 80, category: "Street", desc: "Steamed vegetable momos served with spicy chutney.", img: "https://images.pexels.com/photos/28445593/pexels-photo-28445593.jpeg"},
  { _id: "602", name: "Veg Chowmein", price: 70, category: "Street", desc: "Stir-fried noodles with fresh vegetables.", img: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=800"},
  { _id: "603", name: "Veg Burger", price: 60, category: "Fast Food", desc: "Crispy veg patty burger with fresh veggies.", img: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800"},

  { _id: "701", name: "Veg Pizza", price: 150, category: "Fast Food", desc: "Cheesy pizza topped with fresh vegetables.", img: "https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg?auto=compress&cs=tinysrgb&w=800"},
  { _id: "702", name: "French Fries", price: 50, category: "Snacks", desc: "Crispy golden fried potato fries.", img: "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=800"},
  { _id: "703", name: "Red Sauce Pasta", price: 120, category: "Fast Food", desc: "Creamy pasta with vegetables and herbs.", img: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800"},

  { _id: "801", name: "Veg Maggie", price: 40, category: "Snacks", desc: "Classic masala maggie with vegetables.", img: "https://images.pexels.com/photos/17499766/pexels-photo-17499766.jpeg"},
  { _id: "802", name: "Veg Sandwich", price: 50, category: "Snacks", desc: "Grilled sandwich stuffed with vegetables and cheese.", img: "https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg?auto=compress&cs=tinysrgb&w=800"},
  { _id: "803", name: "Spring Roll", price: 90, category: "Starters", desc: "Crispy fried spring rolls with veg filling.", img: "https://images.pexels.com/photos/840216/pexels-photo-840216.jpeg"},
  { _id: "804", name: "Veg Manchurian", price: 110, category: "Starters", desc: "Deep-fried veg balls tossed in spicy sauce.", img: "https://images.pexels.com/photos/31783383/pexels-photo-31783383.jpeg"}



  
  
];

const HERO_VIDEO = "/mnt/data/5b7587fe71955148ed13d3554d0455c7.mp4"; // retained for reference
const HERO_PLACEHOLDER = "/mnt/data/ebe9283f-b337-425a-9c28-4ad27259f757.png";

export default function MenuPage({ items: parentItems = null, onAdd: parentAdd = null }) {
  const [items, setItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  // ---------- Reveal observer: trigger earlier so cards appear with less scrolling ----------
  useEffect(() => {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    // threshold same, but rootMargin positive on bottom => observe BEFORE the element is fully in view
    { threshold: 0.06, rootMargin: "0px 0px 200px 0px" });

    function observeAllReveals() {
      const nodes = Array.from(document.querySelectorAll(".reveal:not(.is-revealed)"));
      nodes.forEach(n => {
        try { io.observe(n); } catch (e) {}
      });
    }

    observeAllReveals();

    const mo = new MutationObserver((mutations) => {
      let added = false;
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              if (node.classList && node.classList.contains && node.classList.contains("reveal")) {
                try { io.observe(node); } catch (e) {}
                added = true;
              }
              const inner = node.querySelector && node.querySelectorAll && node.querySelectorAll(".reveal:not(.is-revealed)");
              if (inner && inner.length) {
                inner.forEach(n => { try { io.observe(n); } catch (e) {} });
                added = true;
              }
            }
          });
        }
      }
      if (added) observeAllReveals();
    });

    mo.observe(document.body, { childList: true, subtree: true });
    const retryTimer = setTimeout(observeAllReveals, 160);

    return () => {
      clearTimeout(retryTimer);
      try { mo.disconnect(); } catch (e) {}
      try { io.disconnect(); } catch (e) {}
    };
  }, []);
  // ---------------------------------------------------------------------------------------

  useEffect(() => {
    console.log('MenuPage useEffect: parentItems =', parentItems);
    if (Array.isArray(parentItems) && parentItems.length > 0) {
      console.log('Using parentItems:', parentItems);
      setItems(parentItems);
    } else {
      console.log('parentItems empty or null, using SAMPLE_MENU');
      setItems(SAMPLE_MENU);
    }

    try {
      const raw = JSON.parse(localStorage.getItem("cimage_cart_v1") || "{}");
      const c = Object.values(raw).reduce((s, v) => s + v, 0);
      setCartCount(c);
    } catch {
      setCartCount(0);
    }
  }, [parentItems]);

  function localAdd(itemId) {
    // tiny debug log so you can confirm clicks register in console
    console.log("localAdd called for item:", itemId);

    if (typeof parentAdd === "function") {
      parentAdd(itemId);
      return;
    }
    const raw = JSON.parse(localStorage.getItem("cimage_cart_v1") || "{}");
    raw[itemId] = (raw[itemId] || 0) + 1;
    localStorage.setItem("cimage_cart_v1", JSON.stringify(raw));
    const c = Object.values(raw).reduce((s, v) => s + v, 0);
    setCartCount(c);

    const toast = document.createElement("div");
    toast.innerText = "Added to cart";
    toast.className = "fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1200);
  }

  const categories = ["All", ...Array.from(new Set(items.map(i => i.category)))];
  const visible = items.filter(it => {
    const q = query.trim().toLowerCase();
    const matchesQ = q === "" || it.name.toLowerCase().includes(q) || (it.desc || "").toLowerCase().includes(q);
    const matchesC = category === "All" || it.category === category;
    return matchesQ && matchesC;
  });

  return (
    <div className="min-h-screen bg-[#050607] text-gray-200">
      {/* Page-scoped minimal CSS for reveal + interactivity */}
      <style>{`
        /* reveal: hidden by default, slide slightly; trigger earlier above */
        .reveal { opacity: 0; transform: translateY(12px); transition: opacity .5s cubic-bezier(.2,.9,.2,1), transform .5s cubic-bezier(.2,.9,.2,1); pointer-events: none; }
        .reveal.is-revealed { opacity: 1; transform: translateY(0); pointer-events: auto; }

        /* card hover */
        .menu-card { transition: transform .28s cubic-bezier(.2,.9,.2,1), box-shadow .28s cubic-bezier(.2,.9,.2,1); will-change: transform, box-shadow; }
        .menu-card:hover, .menu-card:focus-within { transform: translateY(-8px) scale(1.01); box-shadow: 0 18px 40px rgba(0,0,0,0.45); }

        /* pay button microinteraction */
        .btn-pay { transition: transform .18s ease, box-shadow .18s ease; }
        .btn-pay:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.22); }

        /* small stagger utility */
        .reveal[data-delay="1"]{ transition-delay: .08s; }
        .reveal[data-delay="2"]{ transition-delay: .14s; }
        .reveal[data-delay="3"]{ transition-delay: .20s; }
      `}</style>

      <div className="max-w-7xl mx-auto py-10">
        {/* HERO */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          <div>
            <h1 className="font-serif text-5xl md:text-6xl reveal" data-delay="1">
              <span className="text-yellow-300">
                <Typing text="Welcome to CIMAGE Canteen — Vegetarian Menu" />
              </span>
            </h1>
            <p className="mt-3 text-gray-400 max-w-xl reveal" data-delay="2">Fresh Indian classics, curated for students. Click Add to push items into cart.</p>

            <div className="mt-6 flex gap-3 items-center reveal" data-delay="3">
              <div className="bg-[#0f1724] px-3 py-2 rounded-full border border-[#1f2937]">
                <span className="text-sm text-gray-300">Items</span>
                <span className="ml-2 font-semibold text-amber-400">{items.length}</span>
              </div>

              <div className="bg-[#0f1724] px-3 py-2 rounded-full border border-[#1f2937]">
                <span className="text-sm text-gray-300">Cart</span>
                <span className="ml-2 font-semibold text-amber-400">{cartCount}</span>
              </div>
            </div>
          </div>

          <div
            className="hero-media reveal"
            data-file-url={HERO_VIDEO}
            aria-hidden="true"
            title="Hero area — video removed"
            style={{ backgroundImage: `url("${HERO_PLACEHOLDER}")` }}
          />
        </div>

        {/* controls */}
        <div className="flex items-center justify-between mb-6 gap-4 reveal" data-delay="1">
          <div className="flex gap-3 items-center">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search dishes..." className="px-3 py-2 bg-[#0b1220] border border-[#1f2937] rounded-full outline-none" />
            <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2 bg-[#0b1220] border border-[#1f2937] rounded-full">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="text-sm text-gray-400">Tip: Click <span className="text-amber-400 font-medium">Add</span> to add to cart</div>
        </div>

        {/* sticky section example */}
        <StickyScroll>
          <div className="sticky-item p-6 rounded-lg bg-[#071018] reveal" data-delay="2">
            <h3 className="text-lg font-semibold">Chef's Recommendation</h3>
            <p className="text-gray-400 mt-2">Try the Paneer Butter Masala with Tandoori Roti.</p>
          </div>
        </StickyScroll>

        {/* menu grid */}
        <div className="reveal" data-delay="2">
          <MenuGrid items={visible} onAdd={(id) => localAdd(id)} />
        </div>

      </div>
    </div>
  );
}
