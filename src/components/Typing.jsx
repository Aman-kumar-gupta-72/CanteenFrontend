// src/components/Typing.jsx
import React, { useEffect, useState } from "react";

/**
 * Typing component
 * Props:
 *  - text: string to type
 *  - speed: ms per character (default 40)
 *  - loop: boolean (default false)
 */
export default function Typing({ text = "", speed = 40, loop = false }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let mounted = true;
    let i = 0;
    function step() {
      if (!mounted) return;
      if (i <= text.length) {
        setOut(text.slice(0, i));
        i++;
        setTimeout(step, speed);
      } else if (loop) {
        setTimeout(() => {
          i = 0;
          step();
        }, 1200);
      }
    }
    step();
    return () => (mounted = false);
  }, [text, speed, loop]);
  return (
    <span className="typing-text">
      {out}
      <span className="blinking-cursor">▌</span>
    </span>
  );
}
