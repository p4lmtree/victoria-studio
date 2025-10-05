// src/components/ScribbleOnHover.js (Modified)

import React from "react"; 
import { motion } from "framer-motion"; 

const FREEFORM_PATH = 
  "M2.72,72.5c-6.25,53,13.44,69.67,17.27,72.67,36.28,28.42,126.65-12.35,146.06-72.67,1.32-4.11,12.31-39.78-5.76-59-21.65-23.04-72.89-9.54-102.89,12.23-25.62,18.59-36.62,43.87-41.01,56.12";
const STROKE_LENGTH = 1000; 

const drawVariants = {
  hidden: {
    strokeDashoffset: STROKE_LENGTH,
    opacity: 0,
    transition: { duration: 0.2 } // Ensure it hides quickly
  },
  visible: {
    strokeDashoffset: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

const ScribbleOnHover = ({ isHovered, children }) => {
  return (
    // 🔥 1. Remove AnimatePresence and conditional rendering 🔥
    <div className="scribble-link-wrapper">
      
      {/* 2. The SVG is now permanently mounted */}
      <motion.svg
        className="scribble-svg"
        viewBox="0 0 200 200"
        preserveAspectRatio="none" 
      >
        <motion.path
          className="svgpath"
          d={FREEFORM_PATH}
          fill="none"
          stroke="rgba(17, 17, 17, 0.7)" 
          strokeLinecap="round"
          strokeWidth="2.5" 
          strokeDasharray={STROKE_LENGTH} 
          
          initial="hidden"
          // 🔥 3. Control animation directly via isHovered 🔥
          animate={isHovered ? "visible" : "hidden"} 
          variants={drawVariants} 
        />
      </motion.svg>
      
      <span className="scribble-content">{children}</span>
    </div>
  );
};

export default ScribbleOnHover;