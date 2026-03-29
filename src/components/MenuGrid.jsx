// src/components/MenuGrid.jsx
import React from "react";

/**
 * Simple MenuGrid: receives items (array) and onAdd(itemId)
 */
export default function MenuGrid({ items = [], onAdd = () => {} }) {
  if (!items || items.length === 0) {
    return <div className="text-gray-400">No items available</div>;
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      {items.map((it, index) => (
        <div
          key={it._id}
          className="menu-card reveal bg-[#0e0e0f] p-4 rounded-xl border border-neutral-800 flex flex-col"
          data-delay={index % 3}
        >
          <div className="w-full h-44 rounded-lg overflow-hidden bg-gray-800">
            <img src={it.img} alt={it.name} className="w-full h-full object-cover" />
          </div>

          <div className="mt-3 flex-1">
            <div className="font-medium text-lg">{it.name}</div>
            <div className="text-sm text-gray-400 mt-1">{it.desc}</div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-amber-400 font-bold">₹{it.price}</div>
            <button
              onClick={() => onAdd(it._id)}
              className="bg-amber-400 text-black px-3 py-1 rounded"
            >
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
