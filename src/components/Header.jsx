import React, { useRef, useState, useEffect } from "react"; 
import { motion, useScroll, useTransform } from "framer-motion";
import "./Header.css"; // CSS import must be present (and the file now exists)

// --- CONFIGURATION ---
const LINES = ["Victoria", "Plasteig", "Studio"];

// The data structure allows for unique color and background color for every burst item.
const WORD_BURSTS = {
  "Victoria": [
    { content: "CREATIVE", delay: 0.05, startX: 20, offsetX: 40, offsetY: 95, color: "#19221bff", bgColor: "rgba(156, 229, 92, 0.9)" }, 
    { content: "DESIGNER", delay: 0.15, startX: 80, offsetX: 40, offsetY: 115, color: "#b50338ff", bgColor: "rgba(255, 160, 209, 0.85)" }, 
    { content: "PORTFOLIO", delay: 0.25, startX: 50, offsetX: 80, offsetY: 25, color: "#c75a00ff", bgColor: "rgba(255, 200, 0, 0.9)" }, 
    { content: "💡", delay: 0.35, startX: 10, offsetX: -20, offsetY: -50, color: "#FFFFFF", bgColor: "transparent" },
  ],
  "Plasteig": [
    { content: "BRANDING", delay: 0.05, startX: 10, offsetX: 5, offsetY: -40, color: "#0243d0ff", bgColor: "rgba(128, 171, 255, 0.8)" },
    { content: "STORYTELLER", delay: 0.15, startX: 20, offsetX: -95, offsetY: 60, color: "#787051ff", bgColor: "rgba(249, 234, 192, 0.9)" },
    { content: "STRATEGY", delay: 0.25, startX: 45, offsetX: 60, offsetY: 80, color: "#FFFFFF", bgColor: "rgba(75, 0, 130, 0.7)" },
    { content: "✨", delay: 0.35, startX: 95, offsetX: -10, offsetY: -30, color: "#FFFFFF", bgColor: "transparent" },
  ],
  "Studio": [
    { content: "COLLAB", delay: 0.05, startX: 30, offsetX: -10, offsetY: -45, color: "#000000", bgColor: "rgba(169, 169, 169, 0.8)" },
    { content: "PROJECTS", delay: 0.15, startX: 85, offsetX: 15, offsetY: -65, color: "#FFFFFF", bgColor: "rgba(95, 158, 160, 0.9)" },
    { content: "LET'S WORK", delay: 0.25, startX: 5, offsetX: -65, offsetY: 45, color: "#000000", bgColor: "rgba(240, 230, 140, 0.8)" },
    { content: "🚀", delay: 0.35, startX: 60, offsetX: 20, offsetY: -55, color: "#FFFFFF", bgColor: "transparent" },
  ],
};

// --- FRAMER MOTION VARIANTS (UNCHANGED) ---
const textContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.5,
    },
  },
};

const letterVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { 
    y: "0%", 
    opacity: 1, 
    transition: { 
      ease: [0.25, 1, 0.5, 1],
      duration: 1.2 
    } 
  },
};
// ----------------------------------------------------------------------


// --- HoverBurst Component (CRITICAL FIX: Applying colors via 'initial' and 'animate') ---
const HoverBurst = ({ isHovered, word }) => {
  const items = WORD_BURSTS[word] || [];
  
  return (
    <motion.div className="burst-container">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="burst-item"
          // Colors are included in initial and animate to ensure Framer Motion applies them 
          // with high priority, overriding potential CSS conflicts.
          initial={{ 
            opacity: 0, 
            scale: 0.5, 
            x: `${item.startX}%`, 
            y: 0, 
            rotate: 0,
            // 🎨 Applying unique colors for each item
            color: item.color,         
            backgroundColor: item.bgColor, 
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.5,
            x: isHovered ? `calc(${item.startX}% + ${item.offsetX}px)` : `${item.startX}%`,
            y: isHovered ? item.offsetY : 0,
            rotate: isHovered ? (Math.random() * 10 - 5) : 0,
            // 🎨 Re-applying colors to ensure they persist during the animation states
            color: item.color,           
            backgroundColor: item.bgColor, 
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: isHovered ? item.delay : 0, 
            duration: isHovered ? 0.3 : 0.2,
          }}
        >
          {item.content}
        </motion.div>
      ))}
    </motion.div>
  );
};
// -----------------------------------------------------------


export default function Header() {
  const containerRef = useRef(null);
  const [hoveredBand, setHoveredBand] = useState(null); 
  const [hasAnimated, setHasAnimated] = useState(false);

  // Animation State Controller (Runs once on mount)
  useEffect(() => {
      setHasAnimated(true);
  }, []);

  // FRAMER MOTION SCROLL LOGIC
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

  return (
    <> 
      {/* The fixed div applies the scroll-based blur filter. */}
      <motion.div 
          className="background-blur-fixed" 
          style={{ filter }} 
      >
          <video 
              className="background-video"
              autoPlay 
              loop 
              muted 
              playsInline 
              src="./video/background.mp4" 
          />
      </motion.div>
      
      <section ref={containerRef} className="header-container">
        <div className="header-sticky">

          {LINES.map((word, i) => {
            
            const isCurrentBandHovered = hoveredBand === i; 
            
            const bandClass = i === 0 ? "header-band header-band-first" : "header-band";

            return (
              <motion.div
                key={i}
                className={bandClass}
                initial={{ opacity: 1 }} 
                animate={{ opacity: 1 }}
                
                // HOVER HANDLERS
                onMouseEnter={() => setHoveredBand(i)}
                onMouseLeave={() => setHoveredBand(null)}
              >
                <motion.div
                  className="header-text-inner"
                  variants={textContainerVariants}
                  initial="hidden"
                  animate={hasAnimated ? "visible" : "hidden"}
                  style={{ position: 'relative' }} 
                >
                  
                  {/* The Burst Element */}
                  <HoverBurst 
                    isHovered={isCurrentBandHovered}
                    word={word}
                  />
                  
                  {word.split("").map((ch, j) => {
                    return (
                      <motion.span
                        key={j}
                        className="header-letter"
                        variants={letterVariants}
                      >
                        {ch === " " ? "\u00A0" : ch}
                      </motion.span>
                    );
                  })}
                </motion.div>
              </motion.div>
              
            );
          })}
        </div>
      </section>
    </>
  );
}