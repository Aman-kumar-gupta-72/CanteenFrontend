import { useState } from "react";

// ✅ IMPORT IMAGES (this is REQUIRED in Vite)
import alooParatha from "../assets/menu/aloo-paratha.jpg";
import poha from "../assets/menu/poha.jpg";
import paneerButterMasala from "../assets/menu/paneer-butter-masala.jpg";
import chickenCurry from "../assets/menu/chicken-curry.jpg";
import samosa from "../assets/menu/samosa.jpg";
import tea from "../assets/menu/tea.jpg";
import coffee from "../assets/menu/coffee.jpg";

const menuData = {
  Breakfast: [
    {
      id: 1,
      name: "Aloo Paratha",
      type: "veg",
      price: 50,
      img: alooParatha
    },
    {
      id: 2,
      name: "Poha",
      type: "veg",
      price: 30,
      img: poha
    }
  ],

  Lunch: [
    {
      id: 3,
      name: "Paneer Butter Masala",
      type: "veg",
      price: 100,
      img: paneerButterMasala
    },
    {
      id: 4,
      name: "Chicken Curry",
      type: "non-veg",
      price: 120,
      img: chickenCurry
    }
  ],

  Snacks: [
    {
      id: 5,
      name: "Samosa",
      type: "veg",
      price: 20,
      img: samosa
    }
  ],

  Beverages: [
    {
      id: 6,
      name: "Tea",
      type: "veg",
      price: 10,
      img: tea
    },
    {
      id: 7,
      name: "Coffee",
      type: "veg",
      price: 15,
      img: coffee
    }
  ]
};

export default function Menu() {
  const [activeTab, setActiveTab] = useState("Breakfast");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CIMAGE College Canteen</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {Object.keys(menuData).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {menuData[activeTab].map(item => (
          <div key={item.id} className="border rounded shadow p-2">
            
            {/* ✅ IMAGE */}
            <div className="h-32 overflow-hidden rounded">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-2 flex justify-between items-center">
              <span
                className={`px-2 py-1 text-white rounded ${
                  item.type === "veg" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {item.type.toUpperCase()}
              </span>
              <span>₹{item.price}</span>
            </div>

            <button className="mt-2 w-full bg-blue-500 text-white py-1 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
