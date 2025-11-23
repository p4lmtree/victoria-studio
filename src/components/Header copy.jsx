import React, { useRef, useState, useEffect } from "react"; // 🔥 Added useEffect
import { motion, useScroll, useTransform } from "framer-motion";
// 🔥 Import GSAP
import { gsap } from 'gsap'; 
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
  const letterRefs = useRef([]); // 🔥 Array to hold refs for all letters

  // State to track which word/band is currently being hovered
  const [hoveredBand, setHoveredBand] = useState(null); 

  // --- 1. GSAP ENTRANCE ANIMATION (Replaces old letter scroll logic) ---
  useEffect(() => {
    // 1. Set initial state: hidden below the line, fully transparent
    gsap.set(letterRefs.current, {
        yPercent: 100, // Start 100% down (hidden below the line)
        opacity: 0,
        // CRITICAL: Ensure visibility is set to auto so it doesn't clip on start
        visibility: 'visible', 
    });

    // 2. Create the entrance animation timeline
    const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 1.2 } });

    // 3. Animate all letters into view with a stagger
    tl.to(letterRefs.current, {
        yPercent: 0,
        opacity: 1,
        // 🔥 STAGGER: The magic for the wave-like reveal
        stagger: 0.03, 
        delay: 0.5 // Start the letter animation after 0.5 seconds
    });

    // Cleanup function
    return () => {
        tl.kill(); // Kills the timeline when the component unmounts
    };
  }, []); 
  // -------------------------------------------------------------------


  // --- 2. FRAMER MOTION SCROLL LOGIC (Remains for Band movement) ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const blurProgress = useTransform(
    scrollYProgress,
    [0, 1], 
    [0, 30], 
    { clamp: true }
  );
  const filter = useTransform(blurProgress, (b) => `blur(${b}px)`);
  // -------------------------------------------------------------------

  // Helper function to reset the refs array on render
  const setLetterRef = (element, index) => {
    if (element) {
        letterRefs.current[index] = element;
    }
  };

  // Calculate the total number of letters to use as the index key
  const totalLetters = LINES.join('').length;
  let letterCounter = 0; 


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
            const isCurrentBandHovered = hoveredBand === i; 

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
                
                // HOVER HANDLERS
                onMouseEnter={() => setHoveredBand(i)}
                onMouseLeave={() => setHoveredBand(null)}
              >
                {/* CRITICAL: The header-text-inner container must have 
                  'overflow: hidden' in CSS for the Y-slide to work! 
                */}
                <div className="header-text-inner">
                  
                  {/* FLOATING HOVER LABEL - (UNMODIFIED) */}
                  <motion.div
                      className="hover-label"
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ 
                          opacity: isCurrentBandHovered ? 1 : 0, 
                          y: isCurrentBandHovered ? -20 : 10, 
                          scale: isCurrentBandHovered ? 1 : 0.8 
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                      {LABELS[word]}
                  </motion.div>
                  
                  {word.split("").map((ch, j) => {
                    
                    const currentIndex = letterCounter++;

                    return (
                      // 🔥 NOW A REGULAR SPAN with a ref for GSAP 🔥
                      <span
                        key={j}
                        className="header-letter"
                        ref={el => setLetterRef(el, currentIndex)}
                        // Set the initial visibility state to 'hidden' to prevent FOUC (Flash of Unstyled Content)
                        style={{ visibility: 'hidden' }} 
                      >
                        {ch === " " ? "\u00A0" : ch}
                      </span>
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