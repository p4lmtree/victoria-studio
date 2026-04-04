import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./Header.css";

const LINES = ["Victoria", "Plasteig", "Studio"];

const WORD_BURSTS = {
  "Victoria": [
    { content: "CREATIVE",            delay: 0.05, startX: 20, offsetX: 40,  offsetY: 95,  mobileOffsetX: 20,  mobileOffsetY: 55,  color: "#19221bff", bgColor: "rgba(156,229,92,0.9)"  },
    { content: "DESIGNER",            delay: 0.15, startX: 70, offsetX: 40,  offsetY: 115, mobileOffsetX: 20,  mobileOffsetY: 65,  color: "#b50338ff", bgColor: "rgba(255,160,209,0.85)" },
    { content: "and cool human bean", delay: 0.25, startX: 45, offsetX: 80,  offsetY: 25,  mobileOffsetX: 30,  mobileOffsetY: 20,  color: "#c75a00ff", bgColor: "rgba(255,200,0,0.9)"    },
    { content: "💡",                  delay: 0.35, startX: 10, offsetX: -20, offsetY: -50, mobileOffsetX: -10, mobileOffsetY: -30, color: "#FFFFFF",   bgColor: "transparent"            },
  ],
  "Plasteig": [
    { content: "BRANDING",     delay: 0.05, startX: 10, offsetX: 5,   offsetY: -40, mobileOffsetX: 5,   mobileOffsetY: -25, color: "#0243d0ff", bgColor: "rgba(128,171,255,0.8)"  },
    { content: "STORYTELLING", delay: 0.15, startX: 20, offsetX: -95, offsetY: 60,  mobileOffsetX: -45, mobileOffsetY: 40,  color: "#787051ff", bgColor: "rgba(249,234,192,0.9)"  },
    { content: "STRATEGY",     delay: 0.25, startX: 55, offsetX: 60,  offsetY: 80,  mobileOffsetX: 30,  mobileOffsetY: 50,  color: "#FFFFFF",   bgColor: "rgba(75,0,130,0.7)"     },
    { content: "✨",           delay: 0.35, startX: 85, offsetX: -10, offsetY: -30, mobileOffsetX: -5,  mobileOffsetY: -20, color: "#FFFFFF",   bgColor: "transparent"            },
  ],
  "Studio": [
    { content: "COLLAB",      delay: 0.05, startX: 30, offsetX: -10, offsetY: -45, mobileOffsetX: -5,  mobileOffsetY: -28, color: "#000000", bgColor: "rgba(169,169,169,0.8)" },
    { content: "PROJECTS",    delay: 0.15, startX: 75, offsetX: 15,  offsetY: -65, mobileOffsetX: 10,  mobileOffsetY: -40, color: "#FFFFFF", bgColor: "rgba(95,158,160,0.9)"  },
    { content: "LET'S WORK!", delay: 0.25, startX: 5,  offsetX: -65, offsetY: 45,  mobileOffsetX: -30, mobileOffsetY: 30,  color: "#000000", bgColor: "rgba(240,230,140,0.8)" },
    { content: "🚀",          delay: 0.35, startX: 55, offsetX: 20,  offsetY: -55, mobileOffsetX: 10,  mobileOffsetY: -32, color: "#FFFFFF", bgColor: "transparent"           },
  ],
};

const textContainerVariants = {
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.5 } },
};

const letterVariants = {
  hidden:  { y: "100%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition: { ease: [0.25, 1, 0.5, 1], duration: 1.2 } },
};

// Burst chips — sibling of .header-text-inner so mask never clips them
const HoverBurst = ({ isHovered, word }) => {
  const items = WORD_BURSTS[word] || [];
  const isMobile = typeof window !== "undefined" && window.innerWidth < 900;

  return (
    <div className="burst-container">
      {items.map((item, index) => {
        const targetX = isMobile ? item.mobileOffsetX : item.offsetX;
        const targetY = isMobile ? item.mobileOffsetY : item.offsetY;
        return (
          <motion.div
            key={index}
            className="burst-item"
            initial={{
              opacity: 0, scale: 0.5,
              x: `${item.startX}%`, y: 0, rotate: 0,
              color: item.color, backgroundColor: item.bgColor,
            }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale:   isHovered ? 1 : 0.5,
              x: isHovered ? `calc(${item.startX}% + ${targetX}px)` : `${item.startX}%`,
              y: isHovered ? targetY : 0,
              rotate: isHovered ? (Math.random() * 10 - 5) : 0,
              color: item.color, backgroundColor: item.bgColor,
            }}
            transition={{
              type: "spring", stiffness: 300, damping: 20,
              delay: isHovered ? item.delay : 0,
              duration: isHovered ? 0.3 : 0.2,
            }}
          >
            {item.content}
          </motion.div>
        );
      })}
    </div>
  );
};

// Renders a single word band
const WordBand = ({ word, index, isHovered, onEnter, onLeave, hasAnimated, bandClass }) => (
  <div
    className={bandClass}
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
    onTouchStart={onEnter}
    onTouchEnd={() => setTimeout(onLeave, 1200)}
  >
    <HoverBurst isHovered={isHovered} word={word} />
    <motion.div
      className="header-text-inner"
      variants={textContainerVariants}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
    >
      {word.split("").map((ch, j) => (
        <motion.span key={j} className="header-letter" variants={letterVariants}>
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </motion.div>
  </div>
);

export default function Header() {
  const containerRef = useRef(null);
  const [hoveredBand, setHoveredBand] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => { setHasAnimated(true); }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const blurProgress = useTransform(scrollYProgress, [0, 1], [0, 30], { clamp: true });
  const filter = useTransform(blurProgress, (b) => `blur(${b}px)`);

  return (
    <>
      <motion.div className="background-blur-fixed" style={{ filter }}>
        <video className="background-video" autoPlay loop muted playsInline src="./video/background.mp4" />
      </motion.div>

      <section ref={containerRef} className="header-container">
        <div className="header-sticky">

          {/* Band 1 — Victoria */}
          <WordBand
            word="Victoria" index={0}
            isHovered={hoveredBand === 0}
            onEnter={() => setHoveredBand(0)}
            onLeave={() => setHoveredBand(null)}
            hasAnimated={hasAnimated}
            bandClass="header-band header-band-first"
          />

          {/* Band 2 — Plasteig */}
          <WordBand
            word="Plasteig" index={1}
            isHovered={hoveredBand === 1}
            onEnter={() => setHoveredBand(1)}
            onLeave={() => setHoveredBand(null)}
            hasAnimated={hasAnimated}
            bandClass="header-band"
          />

          {/* Band 3 — empty separator (mobile/tablet only, hidden on desktop) */}
          <div className="header-band header-band-empty" aria-hidden="true" />

          {/* Band 4 — Studio */}
          <WordBand
            word="Studio" index={2}
            isHovered={hoveredBand === 2}
            onEnter={() => setHoveredBand(2)}
            onLeave={() => setHoveredBand(null)}
            hasAnimated={hasAnimated}
            bandClass="header-band header-band-studio"
          />

          {/* Band 5 — arrow band (mobile/tablet only, hidden on desktop) */}
          <div className="header-band header-band-arrow" aria-hidden="true">
            <motion.span
              className="header-scroll-arrow"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6, ease: "easeOut" }}
            >
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              >
                ↓
              </motion.span>
            </motion.span>
          </div>

        </div>
      </section>
    </>
  );
}
