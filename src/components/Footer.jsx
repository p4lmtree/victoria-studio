import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import "./Footer.css";

// -----------------------------------------------------------
// 1. Define the items for the hover burst
// -----------------------------------------------------------
const BURST_ITEMS = [
  { content: "Play with me?", type: "text", delay: 0.05 },
  { content: "Click!", type: "text", delay: 0.15 },
  { content: "/images/icon-cube.svg", type: "image", delay: 0.25 }, // Use your actual image path
  { content: "Enter the lab...", type: "text", delay: 0.35 },
];

// -----------------------------------------------------------
// 2. HoverBurst Component (Manages Staggered Animation)
// -----------------------------------------------------------
const HoverBurst = ({ isHovered }) => {
  return (
    <motion.div className="burst-container">
      {BURST_ITEMS.map((item, index) => (
        <motion.div
          key={index}
          className={`burst-item item-${index}`}
          initial={{ opacity: 0, scale: 0.5, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.5,
            // 💡 Apply random-like offset for the burst effect
            x: isHovered ? (index % 2 === 0 ? -10 : 10) : 0,
            y: isHovered ? (index % 2 === 0 ? -30 : -50) : 0,
            rotate: isHovered ? (index % 2 === 0 ? -5 : 5) : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            // 🔥 Stagger the items using the defined delay
            delay: isHovered ? item.delay : 0, 
            duration: isHovered ? 0.3 : 0.2,
          }}
        >
          {/* Render text or image based on type */}
          {item.type === "text" ? (
            item.content
          ) : (
            <img src={item.content} alt="burst icon" className="burst-image" />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};


// -----------------------------------------------------------
// 3. Footer Component (Handles Hover State)
// -----------------------------------------------------------
const Footer = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  // The 'playground' word will be the trigger for the animation
  const linkText = "playground"; 

  return (
    <footer id="footer" className="footer">
      <motion.div
        className="playground-link-wrap"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* The staggered burst appears here */}
        <HoverBurst isHovered={isHovered} />
        
        {/* The actual link/text */}
        <a href="/playground" className="playground-link">
          {linkText}
        </a>
      </motion.div>
    </footer>
  );
};

export default Footer;