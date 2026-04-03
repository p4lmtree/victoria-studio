import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./Header.css";

// --- CONFIGURATION ---
const LINES = ["Victoria", "Plasteig", "Studio"];

/*
  Burst offsets are split into desktop and mobile values.
  On small screens the chips travel shorter distances so they
  stay within the visible band and don't clip off-screen.
*/
const WORD_BURSTS = {
  "Victoria": [
    { content: "CREATIVE",           delay: 0.05, startX: 20, offsetX: 40,  offsetY: 95,  mobileOffsetX: 20,  mobileOffsetY: 55,  color: "#19221bff", bgColor: "rgba(156,229,92,0.9)"   },
    { content: "DESIGNER",           delay: 0.15, startX: 70, offsetX: 40,  offsetY: 115, mobileOffsetX: 20,  mobileOffsetY: 65,  color: "#b50338ff", bgColor: "rgba(255,160,209,0.85)"  },
    { content: "and cool human bean",delay: 0.25, startX: 45, offsetX: 80,  offsetY: 25,  mobileOffsetX: 30,  mobileOffsetY: 20,  color: "#c75a00ff", bgColor: "rgba(255,200,0,0.9)"     },
    { content: "💡",                 delay: 0.35, startX: 10, offsetX: -20, offsetY: -50, mobileOffsetX: -10, mobileOffsetY: -30, color: "#FFFFFF",   bgColor: "transparent"             },
  ],
  "Plasteig": [
    { content: "BRANDING",     delay: 0.05, startX: 10, offsetX: 5,   offsetY: -40, mobileOffsetX: 5,   mobileOffsetY: -25, color: "#0243d0ff", bgColor: "rgba(128,171,255,0.8)"  },
    { content: "STORYTELLING", delay: 0.15, startX: 20, offsetX: -95, offsetY: 60,  mobileOffsetX: -45, mobileOffsetY: 40,  color: "#787051ff", bgColor: "rgba(249,234,192,0.9)"  },
    { content: "STRATEGY",     delay: 0.25, startX: 55, offsetX: 60,  offsetY: 80,  mobileOffsetX: 30,  mobileOffsetY: 50,  color: "#FFFFFF",   bgColor: "rgba(75,0,130,0.7)"     },
    { content: "✨",           delay: 0.35, startX: 85, offsetX: -10, offsetY: -30, mobileOffsetX: -5,  mobileOffsetY: -20, color: "#FFFFFF",   bgColor: "transparent"            },
  ],
  "Studio": [
    { content: "COLLAB",      delay: 0.05, startX: 30, offsetX: -10, offsetY: -45, mobileOffsetX: -5,  mobileOffsetY: -28, color: "#000000", bgColor: "rgba(169,169,169,0.8)"  },
    { content: "PROJECTS",    delay: 0.15, startX: 75, offsetX: 15,  offsetY: -65, mobileOffsetX: 10,  mobileOffsetY: -40, color: "#FFFFFF", bgColor: "rgba(95,158,160,0.9)"   },
    { content: "LET'S WORK!", delay: 0.25, startX: 5,  offsetX: -65, offsetY: 45,  mobileOffsetX: -30, mobileOffsetY: 30,  color: "#000000", bgColor: "rgba(240,230,140,0.8)"  },
    { content: "🚀",          delay: 0.35, startX: 55, offsetX: 20,  offsetY: -55, mobileOffsetX: 10,  mobileOffsetY: -32, color: "#FFFFFF", bgColor: "transparent"            },
  ],
};

// --- FRAMER MOTION VARIANTS (unchanged) ---
const textContainerVariants = {
  visible: {
    transition: { staggerChildren: 0.03, delayChildren: 0.5 },
  },
};

const letterVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { ease: [0.25, 1, 0.5, 1], duration: 1.2 },
  },
};

// --- HoverBurst ---
const HoverBurst = ({ isHovered, word }) => {
  const items = WORD_BURSTS[word] || [];

  // Detect mobile once on mount — avoids re-renders on every frame
  const isMobile = typeof window !== "undefined" && window.innerWidth < 900;

  return (
    <motion.div className="burst-container">
      {items.map((item, index) => {
        const targetX = isMobile ? item.mobileOffsetX : item.offsetX;
        const targetY = isMobile ? item.mobileOffsetY : item.offsetY;

        return (
          <motion.div
            key={index}
            className="burst-item"
            initial={{
              opacity: 0,
              scale: 0.5,
              x: `${item.startX}%`,
              y: 0,
              rotate: 0,
              color: item.color,
              backgroundColor: item.bgColor,
            }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.5,
              x: isHovered ? `calc(${item.startX}% + ${targetX}px)` : `${item.startX}%`,
              y: isHovered ? targetY : 0,
              rotate: isHovered ? (Math.random() * 10 - 5) : 0,
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
        );
      })}
    </motion.div>
  );
};

// --- Main Header ---
export default function Header() {
  const containerRef = useRef(null);
  const [hoveredBand, setHoveredBand] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const blurProgress = useTransform(scrollYProgress, [0, 1], [0, 30], { clamp: true });
  const filter = useTransform(blurProgress, (b) => `blur(${b}px)`);

  return (
    <>
      <motion.div className="background-blur-fixed" style={{ filter }}>
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
                onMouseEnter={() => setHoveredBand(i)}
                onMouseLeave={() => setHoveredBand(null)}
                /* Tap support for mobile */
                onTouchStart={() => setHoveredBand(i)}
                onTouchEnd={() => setTimeout(() => setHoveredBand(null), 1200)}
              >
                <motion.div
                  className="header-text-inner"
                  variants={textContainerVariants}
                  initial="hidden"
                  animate={hasAnimated ? "visible" : "hidden"}
                  style={{ position: "relative" }}
                >
                  <HoverBurst isHovered={isCurrentBandHovered} word={word} />

                  {word.split("").map((ch, j) => (
                    <motion.span
                      key={j}
                      className="header-letter"
                      variants={letterVariants}
                    >
                      {ch === " " ? "\u00A0" : ch}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}
