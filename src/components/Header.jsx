import React, { useRef, useState } from "react"; // ⬅️ Added useState
import { motion, useScroll, useTransform } from "framer-motion";
import "./Header.css";

const LINES = ["Victoria", "Plasteig", "Studio"];
const BANDS = LINES.length;

// Helper object for custom labels
const LABELS = {
  "Victoria": "CREATIVE DESIGNER",
  "Plasteig": "BRAND STORYTELLER",
  "Studio": "LET'S WORK TOGETHER!",
};

export default function Header() {
  const containerRef = useRef(null);
  
  // State to track which word/band is currently being hovered
  const [hoveredBand, setHoveredBand] = useState(null); // Tracks the index (i) of the hovered band

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ... (Blur and Filter logic remains the same) ...
  const blurProgress = useTransform(
    scrollYProgress,
    [0, 1], 
    [0, 30], 
    { clamp: true }
  );

  const filter = useTransform(blurProgress, (b) => `blur(${b}px)`);
  // ... (End Blur and Filter logic) ...


  return (
        <> 
      <motion.div 
          className="background-blur-fixed" 
          style={{ filter }} 
      />
    <section ref={containerRef} className="header-container">
      <div className="header-sticky">

        
        {LINES.map((word, i) => {
          
          const start = i / BANDS;
          const end = (i + 1) / BANDS;
          const isCurrentBandHovered = hoveredBand === i; // Check if THIS band is hovered

          // Animate the whole band to slide into place (X-axis)
          const x = useTransform(
            scrollYProgress,
            [start, end],
            [i % 2 === 0 ? "-200px" : "200px", "0px"],
            { clamp: true }
          );

          // Animate the band's opacity (Fades the whole band unit)
          const bandOpacity = useTransform(scrollYProgress, [start, end], [0, 1], { clamp: true });

          return (
            // Apply the X-slide to the whole band and add hover handlers
            <motion.div
              key={i}
              className="header-band"
              style={{ x, opacity: bandOpacity }}
              
              // 🔥 HOVER HANDLERS 🔥
              onMouseEnter={() => setHoveredBand(i)}
              onMouseLeave={() => setHoveredBand(null)}
            >
              <div className="header-text-inner">
                
                {/* 🔥 FLOATING HOVER LABEL 🔥 */}
                <motion.div
                    className="hover-label"
                    
                    // Initial position (hidden)
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    
                    // Animation when hovered (float up and fade in)
                    animate={{ 
                        opacity: isCurrentBandHovered ? 1 : 0, 
                        y: isCurrentBandHovered ? -20 : 10, // Float up by -20px on hover
                        scale: isCurrentBandHovered ? 1 : 0.8 
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    {LABELS[word]}
                </motion.div>
                
                {word.split("").map((ch, j) => {
                  
                  // Tighter timing for per-letter animation
                  const STAGGER_INCREMENT = 0.02; 
                  const ANIMATION_DURATION = 0.1; 

                  const letterStart = start + j * STAGGER_INCREMENT;
                  const letterEnd = Math.min(letterStart + ANIMATION_DURATION, end);

                  // Animate the letter's Y-position (sliding up from below)
                  const y = useTransform(scrollYProgress, [letterStart, letterEnd], ["100%", "0%"], { clamp: true });

                  // Animate the letter's opacity (fade in)
                  const o = useTransform(scrollYProgress, [letterStart, letterEnd], [0, 1], { clamp: true });

                  return (
                    <motion.span
                      key={j}
                      className="header-letter"
                      style={{ y, opacity: o }}
                    >
                      {ch === " " ? "\u00A0" : ch}
                    </motion.span>
                    
                  );
                })}
              </div>
            </motion.div>
            
          );
        })}
      </div>
    </section>
        </>

  );
}