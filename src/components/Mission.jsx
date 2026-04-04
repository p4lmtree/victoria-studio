import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import "./Mission.css";

// =================================================================== //
// ✏️  EDIT THIS — your content                                         //
// =================================================================== //
const MISSION_CONFIG = {
 // eyebrow: "Creative Studio",
  statement: "Hi, I'm Victoria Plasteig, a Netherlands-based designer weaving together brand strategy, identity, and storytelling into visuals that impact people.",
  // descriptor: "Let's work together on your next amazing journey!",
  cta: "See the work",
  ctaTarget: "#gallery-wrapper",

  // Each service: a label + the burst chips that pop on hover
  services: [
        {
      label: "Strategy",
      chips: [
        { content: "Positioning", color: "#b50338", bgColor: "rgba(255,160,209,0.88)" },
        { content: "Brand Narrative",   color: "#fff",    bgColor: "rgba(95,158,160,0.85)"  },
        { content: "Research",    color: "#19221b", bgColor: "rgba(240,230,140,0.88)" },
        { content: "✦",          color: "#c75a00", bgColor: "transparent"             },
        { content: "Vision", color: "#19221b", bgColor: "rgba(200,240,120,0.85)" },
      ],
    },
    {
      label: "Branding",
      chips: [
        { content: "Naming",        color: "#19221b", bgColor: "rgba(156,229,92,0.92)"  },
        { content: "Visual System", color: "#19221b", bgColor: "rgba(200,240,120,0.85)" },
        { content: "Visual Identity",     color: "#fff",    bgColor: "rgba(30,30,30,0.85)"    },
        { content: "✦",              color: "#c75a00", bgColor: "transparent"             },
      ],
    },
    {
      label: "Art Direction",
      chips: [
        { content: "Editorial",    color: "#fff",    bgColor: "rgba(180,80,180,0.75)"  },
        { content: "Campaigns",    color: "#0243d0", bgColor: "rgba(200,220,255,0.9)"  },
        { content: "Photography",  color: "#787051", bgColor: "rgba(249,234,192,0.92)" },
        { content: "✦",           color: "#fff",    bgColor: "transparent"             },
      ],
    },
    {
      label: "Digital & Motion",
      chips: [
        { content: "UX/UI",       color: "#fff",    bgColor: "rgba(75,0,130,0.75)"   },
        { content: "Prototyping", color: "#19221b", bgColor: "rgba(156,229,92,0.85)" },
        { content: "Animation",   color: "#fff",    bgColor: "rgba(210,70,50,0.8)"   },
        { content: "✦",          color: "#fff",    bgColor: "transparent"            },
      ],
    },
  ],
};
// =================================================================== //

// --- Chip scatter positions (startX % along the label, then offsetX/Y on hover) ---
const CHIP_POSITIONS = [
  { startX: 10, offsetX: -25, offsetY: -60 },
  { startX: 35, offsetX:  15, offsetY: -80 },
  { startX: 62, offsetX:  55, offsetY: -50 },
  { startX: 82, offsetX: -15, offsetY: -70 },
];

// --- Letter-by-letter variant (mirrors Header.jsx exactly) ---
const letterVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { ease: [0.25, 1, 0.5, 1], duration: 1.0 },
  },
};

// --- Intro fadeUp ---
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.25, 1, 0.5, 1] },
  }),
};

// --- Divider line ---
const lineVariants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { ease: [0.25, 1, 0.5, 1], duration: 1.1, delay: 0.15 },
  },
};

// --- Single service row ---
const ServiceRow = ({ service, index, isInView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const rowDelay = 0.5 + index * 0.15;

  return (
    <li
      className={`mission-service-item${isHovered ? " is-hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Index letter */}
      <motion.span
        className="mission-service-index"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.35 } : { opacity: 0 }}
        transition={{ delay: rowDelay, duration: 0.6 }}
      >
        {String.fromCharCode(65 + index)}
      </motion.span>

      {/* Label area — clips letters + holds burst chips */}
      <div className="mission-service-label-wrap">

        {/* Burst chips */}
        <div className="mission-chip-container" aria-hidden="true">
          {service.chips.map((chip, ci) => {
            const pos = CHIP_POSITIONS[ci] || CHIP_POSITIONS[0];
            return (
              <motion.span
                key={ci}
                className="mission-chip"
                initial={{
                  opacity: 0,
                  scale: 0.5,
                  x: `${pos.startX}%`,
                  y: 0,
                  color: chip.color,
                  backgroundColor: chip.bgColor,
                }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  scale: isHovered ? 1 : 0.6,
                  x: isHovered
                    ? `calc(${pos.startX}% + ${pos.offsetX}px)`
                    : `${pos.startX}%`,
                  y: isHovered ? pos.offsetY : 0,
                  rotate: isHovered ? (Math.random() * 8 - 4) : 0,
                  color: chip.color,
                  backgroundColor: chip.bgColor,
                }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 22,
                  delay: isHovered ? ci * 0.06 : 0,
                }}
              >
                {chip.content}
              </motion.span>
            );
          })}
        </div>

        {/* Letter-by-letter label — overflow hidden clips the slide-up */}
        <span className="mission-service-label" aria-label={service.label}>
          {service.label.split("").map((ch, li) => (
            <motion.span
              key={li}
              className="mission-service-letter"
              variants={letterVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{
                ease: [0.25, 1, 0.5, 1],
                duration: 1.0,
                delay: rowDelay + li * 0.035,
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </span>
      </div>

      {/* Row border */}
      <div className="mission-service-line" aria-hidden="true" />
    </li>
  );
};

// --- Main ---
export default function Mission() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-8% 0px" });

  const handleCta = (e) => {
    e.preventDefault();
    document
      .querySelector(MISSION_CONFIG.ctaTarget)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="mission-section" ref={ref} aria-label="Mission">
      <div className="mission-rule-left" aria-hidden="true" />

      <div className="mission-inner">

        {/* Eyebrow */}
        <motion.p className="mission-eyebrow" custom={0} variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          {MISSION_CONFIG.eyebrow}
        </motion.p>

        {/* Divider */}
        <motion.div className="mission-divider" variants={lineVariants} initial="hidden" animate={isInView ? "visible" : "hidden"} />

        {/* Statement */}
        <motion.h2 className="mission-statement" custom={1} variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          {MISSION_CONFIG.statement}
        </motion.h2>

        {/* Descriptor */}
        <motion.p className="mission-descriptor" custom={2} variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          {MISSION_CONFIG.descriptor}
        </motion.p>

        {/* CTA */}
      {/*/<motion.div custom={3} variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <a href={MISSION_CONFIG.ctaTarget} className="mission-cta" onClick={handleCta}>
            <span className="mission-cta-label">{MISSION_CONFIG.cta}</span>
            <span className="mission-cta-arrow" aria-hidden="true">↓</span>
          </a>
        </motion.div>*/}

        {/* Services eyebrow */}
        <motion.p className="mission-services-eyebrow" custom={4} variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          My work stretches across the fields of
        </motion.p>

        {/* Services list */}
        <ol className="mission-services-list" aria-label="Services">
          {MISSION_CONFIG.services.map((service, i) => (
            <ServiceRow key={service.label} service={service}  isInView={isInView} />
          ))}
        </ol>

      </div>

      {/* Marquee */}
      <div className="mission-marquee" aria-hidden="true">
        <div className="mission-marquee-track">
          {[...Array(3)].flatMap(() =>
            MISSION_CONFIG.services.map((s, i) => (
              <span key={`${s.label}-${i}`} className="mission-marquee-item">
                {s.label} <span className="mission-marquee-dot">·</span>
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
