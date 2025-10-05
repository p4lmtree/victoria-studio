import React, { useState } from "react";
import { motion } from "framer-motion";
import "./About.css";
import profileImage from "/images/1743874543239679.jpg"; 

// ⬅️ Import the map containing all your SVG components
import SkillSvgMap from "./SVGSkills";


// 💡 Updated component to dynamically select and render the SVG
const DraggableSkill = ({ skill, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const staggerDelay = index * 0.05; 
  
  // Get the correct SVG Component from the map
  // If the skill isn't in the map, it will default to 'div' or a placeholder (good for debugging!)
  const SkillComponent = SkillSvgMap[skill] || 'div'; 

  return (
    <motion.div
      className={`skill-wrapper skill-wrapper-${skill.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      
      // ... (Initial Position, Dragging, Hover Effects remain the same) ...
      initial={{ opacity: 0, scale: 0.5, x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 + staggerDelay, ease: "easeOut" }}
      drag
      dragMomentum={true} 
      whileHover={{ scale: 1.1, zIndex: 100 }}
      whileTap={{ scale: 0.95, cursor: 'grabbing', z: 100 }}
    >
      {/* Hover Message */}
      <motion.span
        className="skill-message"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -5 }}
        transition={{ duration: 0.3 }}
      >
        Let's build?
      </motion.span>

      {/* 🔥 RENDERING THE DYNAMIC SVG 🔥 
          Pass props here to ensure Framer Motion can apply its transformations 
          and styles directly to the root SVG element if needed.
      */}
      <SkillComponent /> 
      
    </motion.div>
  );
};

const SKILL_LIST = [
  "3D", "Motion", "Editorial", "UX/UI", "Branding", 
  "Prototyping", "Strategy", "A.I. Tools"
];


const About = () => {
  return (
    <section id="about" className="about-section">
      <img
        src={profileImage}
        alt="Victoria Plasteig"
        className="about-image"
      />

      <div className="about-content">
        <div className="about-top">
          <div className="about-intro">
            <p>
              <strong>Victoria Plasteig</strong><br />
              <em>— All rights reserved.</em>
            </p>
            <p>Visual Designer / Brand Storyteller.</p>
            <p>Looking forward to develop<br />amazing projects together.</p>
          </div>

          <div className="skills">
            <h3>Skills</h3>
            {/* The skill-cloud is no longer a constraint box, just a wrapper */}
            <div className="skill-cloud">
              {SKILL_LIST.map((skill, index) => (
                <DraggableSkill key={skill} skill={skill} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* ... (Rest of the component remains the same) ... */}
        <hr className="about-divider" />
        <div className="about-bottom">
          {/* ... (Existing Experience and Education Content) ... */}
          <div className="experience">
            <h3>Experience</h3>
            <p>Freelancing<br />(2020 — Now)</p>
            <p>Creative Designer,<br />
              Vorm de Stad<br />(Amsterdam, NL)<br />
              (April 2024 — Now)</p>
              <p>Digital Designer,<br />
              EDHV, Architects of Identity<br />(Eindhoven, NL)<br />
              (June 2022 — June 2023)</p>
            <p>Graphic Design Intern,<br />
              Piet Hein Eek (Eindhoven, NL)<br />
              (Feb 2022 — June 2022)</p>
          </div>

          <div className="education">
            <h3>Education</h3>
            <p>Master Critical Inquiry Lab,<br />
              Design Academy Eindhoven (NL)<br />
              (2018 — 2021)</p>
            <p>Bachelor of Arts, Design and Medias,<br />
              Université Paris-Sorbonne (FR)<br />
              (2016 — 2018)</p>
            <p>Bachelor of Product Design,<br />
              ENSAAMA, Olivier de Serres (FR)</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;