// src/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-6 text-center bg-black/60 text-white mt-12">
      <div className="max-w-4xl mx-auto">
        <p>© {new Date().getFullYear()} CIMAGE Canteen — Designed with <span aria-hidden>❤️</span> by Arshi</p>
      </div>
    </footer>
  );
}
