import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./About.css";
import SkillSvgMap from "./SVGSkills";

// =================================================================== //
// ✏️  EDIT THIS SECTION — fill in your real info                       //
// =================================================================== //
const ABOUT_CONFIG = {
  headline: "About", // section label

  intro: {
    name: "Victoria Plasteig",
    role: "Creative Designer & Art Director",
    // A punchy 1–2 sentence bio. Keep it human.
    bio: "I help brands find their visual voice — through strategy, identity, and design that sticks. Based in Amsterdam, working globally.",
  },

  contact: {
    email: "hello@victoriaplasteig.com", // ✏️ your email
    // Add more lines if you like — each is a { label, value } pair
    extras: [
      { label: "Available for", value: "Enquiries & Collab" },
      { label: "Based in", value: "NL / Remote" },
    ],
  },

  experience: [
    // ✏️ Each entry: { period, role, place }
    // Keep it to 3–4 max, most recent first. No high school. 😄
    { period: "2021 —", role: "Creative Director", place: "Victoria Plasteig Studio" },
    { period: "2024 —", role: "Creative Designer", place: "Vorm de Stad, Amsterdam" },
    { period: "2022 — 23", role: "Creative Designer/Strategist", place: "EDHV, Eindhoven" },
  ],

  skills: [
    "3D", "Motion", "Editorial", "UX/UI",
    "Branding", "Prototyping", "Strategy", "A.I. Tools",
  ],
};
// =================================================================== //

// --- Draggable skill chip ---
const DraggableSkill = ({ skill, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const SkillComponent = SkillSvgMap[skill] || "div";

  return (
    <motion.div
      className={`skill-wrapper skill-wrapper-${skill.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.5, x: Math.random() * 160 - 80, y: Math.random() * 160 - 80 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.05, ease: "easeOut" }}
      drag
      dragMomentum
      whileHover={{ scale: 1.1, zIndex: 100 }}
      whileTap={{ scale: 0.95, cursor: "grabbing" }}
    >
      <motion.span
        className="skill-message"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -5 }}
        transition={{ duration: 0.3 }}
      >
        Let's build?
      </motion.span>
      <SkillComponent />
    </motion.div>
  );
};

// --- Stagger animation ---
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.25, 1, 0.5, 1] },
  }),
};

// --- Main component ---
const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section id="about" className="about-section" ref={ref} aria-label="About">

      {/* ── SECTION HEADER ──────────────────────────────────────── */}
      <motion.div
        className="about-header-row"
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <span className="about-section-label">{ABOUT_CONFIG.headline}</span>
        <div className="about-header-line" aria-hidden="true" />
      </motion.div>

      {/* ── MAIN GRID ────────────────────────────────────────────── */}
      <div className="about-grid">

        {/* COL A — Identity */}
        <motion.div
          className="about-col about-col-identity"
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="about-name">{ABOUT_CONFIG.intro.name}</h2>
          <p className="about-role">{ABOUT_CONFIG.intro.role}</p>
          <p className="about-bio">{ABOUT_CONFIG.intro.bio}</p>
        </motion.div>

        {/* COL B — Contact */}
        <motion.div
          className="about-col about-col-contact"
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <p className="about-col-label">Contact</p>
          <a
            href={`mailto:${ABOUT_CONFIG.contact.email}`}
            className="about-email"
          >
            {ABOUT_CONFIG.contact.email}
          </a>
          <div className="about-contact-extras">
            {ABOUT_CONFIG.contact.extras.map(({ label, value }) => (
              <div className="about-contact-row" key={label}>
                <span className="about-contact-key">{label}</span>
                <span className="about-contact-val">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* COL C — Experience */}
        <motion.div
          className="about-col about-col-experience"
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <p className="about-col-label">Experience</p>
          <ol className="about-exp-list">
            {ABOUT_CONFIG.experience.map(({ period, role, place }) => (
              <li className="about-exp-item" key={`${period}-${role}`}>
                <span className="about-exp-period">{period}</span>
                <span className="about-exp-role">{role}</span>
                <span className="about-exp-place">{place}</span>
              </li>
            ))}
          </ol>
        </motion.div>

        {/* COL D — Skills cloud (full width on mobile) */}
        <motion.div
          className="about-col about-col-skills"
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <p className="about-col-label">Skills &amp; Tools</p>
          <div className="skill-cloud">
            {ABOUT_CONFIG.skills.map((skill, i) => (
              <DraggableSkill key={skill} skill={skill} index={i} />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
