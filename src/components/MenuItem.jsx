// src/components/MenuItem.jsx
import React from "react";

export default function MenuItem({ item, onAdd }) {
  return (
    <div className="bg-gradient-to-br from-[#0f1113] to-[#0b0d0f] rounded-2xl p-4 border border-[#172029] shadow-sm transform hover:-translate-y-1 transition-all duration-200">

      <div className="relative rounded-lg overflow-hidden h-44 mb-4 bg-neutral-900">
        {/* ✅ FIXED IMAGE */}
        <img
        src={item.img}
        alt={item.name}
        className="w-full h-48 object-cover rounded-lg"
        />




        <div className="absolute top-2 left-2 bg-white/10 px-2 py-1 rounded text-xs text-white/90">
          {item.category}
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-100">{item.name}</h3>
        <p className="text-sm text-gray-400 mt-1">{item.desc}</p>

        <div className="mt-3 flex items-center justify-center gap-4">
          <div className="text-amber-400 font-semibold">₹{item.price}</div>

          <button
            onClick={onAdd}
            className="ml-2 bg-amber-400 text-black px-4 py-1 rounded-full font-medium hover:brightness-90"
          >
            Add
          </button>
        </div>
      </div>

    </div>
  );
}
