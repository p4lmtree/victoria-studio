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
      {/* ⚠️ The main change is within this div, using THREE columns ⚠️ */}
      <div className="about-grid-container">
        
        {/* === COLUMN 1: Name and Profile Image Area === */}
        <div className="about-column column-1">
          <h1 className="about-name">
            Hei!
          </h1>
          {/* You can add your profile image here if you want it in the first column */}
          {/* <img src={profileImage} alt="Victoria Plasteig" className="about-image" /> */}
        </div>

        {/* === COLUMN 2: Intro/Contact and Experience === */}
        <div className="about-column column-2">
          <div className="about-intro-contact">
            <p>Looking forward to develop amazing projects together.</p>
            <p>Cool ideas? Let's talk! Drop me an email or draw me a postcard on the playground.</p>
          </div>
        </div>

        <div className="about-column column-3"> 
          <div className="experience">
           <p>Art Direction</p>
           <p>Creative Strategy</p>
          </div>

                    <div className="about-skills-box">
            <div className="skill-cloud">
              {SKILL_LIST.map((skill, index) => (
                <DraggableSkill key={skill} skill={skill} index={index} />
              ))}
            </div>
          </div>
          
        </div>

        {/* === COLUMN 3: Education and Skills Box (The dark grey box) === */}
        <div className="about-column column-4">
          <div className="education">
            <p>Master Critical Inquiry Lab,<br />Design Academy Eindhoven (NL)</p>
            <p>Bachelor of Arts, Design and Medias,<br />Université Paris-Sorbonne (FR)</p>
            <p>Bachelor of Product Design,<br />ENSAAMA, Olivier de Serres (FR)</p>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default About;