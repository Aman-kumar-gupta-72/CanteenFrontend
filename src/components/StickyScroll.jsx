// src/components/StickyScroll.jsx
import React, { useEffect, useRef } from "react";

export default function StickyScroll({ children }) {
  const ref = useRef();

  useEffect(() => {
    const e = ref.current;
    if (!e) return;
    const items = e.querySelectorAll(".sticky-item");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    items.forEach((it) => obs.observe(it));
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="sticky-section mb-8">
      {children}
    </div>
  );
}
