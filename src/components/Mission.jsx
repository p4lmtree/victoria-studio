import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./Mission.css";

// --- CONFIGURATION ---
// ✏️ Replace these placeholder strings with your own copy!
const MISSION_CONFIG = {
  eyebrow: "Creative Studio", // small label above the main statement
  statement: "Your mission statement goes here — make it count.", // your big bold line
  descriptor: "A second sentence that adds nuance or warmth.", // optional supporting line
  tags: ["Branding", "Strategy", "Motion", "Editorial", "UX/UI", "3D"], // your disciplines
  cta: "See the work", // button label — scrolls to #projects
  ctaTarget: "#projects", // scroll target
};

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.25, 1, 0.5, 1], duration: 0.9 },
  },
};

const lineVariants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { ease: [0.25, 1, 0.5, 1], duration: 1.1, delay: 0.2 },
  },
};

const tagVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.5 + i * 0.07, duration: 0.5, ease: "easeOut" },
  }),
};

// --- COMPONENT ---
export default function Mission() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const handleCta = (e) => {
    e.preventDefault();
    const target = document.querySelector(MISSION_CONFIG.ctaTarget);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="mission-section" ref={ref} aria-label="Mission">
      {/* Decorative vertical rule */}
      <div className="mission-rule-left" aria-hidden="true" />

      <motion.div
        className="mission-inner"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Eyebrow */}
        <motion.p className="mission-eyebrow" variants={fadeUp}>
          {MISSION_CONFIG.eyebrow}
        </motion.p>

        {/* Horizontal divider line */}
        <motion.div className="mission-divider" variants={lineVariants} />

        {/* Main statement */}
        <motion.h2 className="mission-statement" variants={fadeUp}>
          {MISSION_CONFIG.statement}
        </motion.h2>

        {/* Descriptor */}
        <motion.p className="mission-descriptor" variants={fadeUp}>
          {MISSION_CONFIG.descriptor}
        </motion.p>

        {/* Tags row */}
        <div className="mission-tags" role="list" aria-label="Disciplines">
          {MISSION_CONFIG.tags.map((tag, i) => (
            <motion.span
              key={tag}
              className="mission-tag"
              role="listitem"
              custom={i}
              variants={tagVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* CTA */}
        <motion.div variants={fadeUp}>
          <a
            href={MISSION_CONFIG.ctaTarget}
            className="mission-cta"
            onClick={handleCta}
            aria-label={MISSION_CONFIG.cta}
          >
            <span className="mission-cta-label">{MISSION_CONFIG.cta}</span>
            <span className="mission-cta-arrow" aria-hidden="true">↓</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Floating marquee strip */}
      <div className="mission-marquee" aria-hidden="true">
        <div className="mission-marquee-track">
          {[...Array(3)].flatMap(() =>
            MISSION_CONFIG.tags.map((tag, i) => (
              <span key={`${tag}-${i}`} className="mission-marquee-item">
                {tag} <span className="mission-marquee-dot">·</span>
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
