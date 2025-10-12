import React, { useState, useEffect } from "react";
import ScribbleOnHover from "./ScribbleOnHover"; // Assuming this is correct
import DarkModeToggle from "./DarkModeToggle";
import { motion, useScroll, useTransform } from "framer-motion";
import "./Navbar.css";

// ------------------------------------------------
// NavLinkWithScribble and handleSmoothScroll (UNCHANGED)
// ------------------------------------------------
const handleSmoothScroll = (event, targetId) => {
    event.preventDefault(); 
    const elementId = targetId.substring(1); 
    const targetElement = document.getElementById(elementId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start' 
        });
    }
};

const NavLinkWithScribble = ({ href, text, onLinkClick }) => { // ⬅️ Added onLinkClick prop
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <motion.li 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={onLinkClick} // ⬅️ Added link click handler
        > 
            <a 
                href={href}
                onClick={(e) => handleSmoothScroll(e, href)} 
                onMouseEnter={() => { setIsHovered(true); }}
                onMouseLeave={() => { setIsHovered(false); }}
            >
                <ScribbleOnHover isHovered={isHovered}>
                    {text}
                </ScribbleOnHover>
            </a>
        </motion.li>
    );
};


const Navbar = () => {
    // ------------------ NEW STATE FOR MOBILE MENU ------------------
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };
    
    // Close menu when a link is clicked (optional but good UX)
    const handleLinkClick = () => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    }
    // ---------------------------------------------------------------
    
    // ... (Theme detection logic remains the same)
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains('dark')
    );
    
    useEffect(() => {
        const checkTheme = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    checkTheme();
                }
            }
        });

        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []); 

    // Framer Motion Styles (UNCHANGED, still applies to the <motion.nav>)
    const SCROLLED_BG_COLOR = isDarkMode 
      ? "rgba(17, 17, 17, 0.95)"
      : "rgba(255, 255, 255, 0.95)";
      
    const SCROLLED_BORDER_COLOR = isDarkMode 
      ? "#333"
      : "#ddd";

    const { scrollYProgress } = useScroll();
    const SCROLL_END = 0.05; 
    
    const backgroundColor = useTransform(
      scrollYProgress,
      [0, SCROLL_END],
      ["rgba(255, 255, 255, 0)", SCROLLED_BG_COLOR]
    );
    
    const borderColor = useTransform(
      scrollYProgress,
      [0, SCROLL_END],
      ["transparent", SCROLLED_BORDER_COLOR] 
    );
    
    const borderWidth = useTransform(
      scrollYProgress,
      [0, SCROLL_END],
      [0, 1]
    );


    return (
        <motion.nav 
            className="navbar"
            style={{ 
                backgroundColor, 
                borderColor, 
                borderBottomWidth: borderWidth 
            }}
        >
            <h1 className="navbar-title">Victoria Plasteig Studio</h1>
            
            {/* 1. HAMBURGER TOGGLE BUTTON (Visible on mobile only) */}
            <button className="menu-toggle" onClick={toggleMenu} aria-expanded={isMenuOpen}>
                <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}></div>
            </button>

            {/* 2. NAVIGATION LINKS (Hide/Show based on screen size/isMenuOpen state) */}
            <ul className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
              <NavLinkWithScribble href="#gallery-wrapper" text="work" onLinkClick={handleLinkClick} />
              <NavLinkWithScribble href="#about" text="about/contact" onLinkClick={handleLinkClick} />
              <NavLinkWithScribble href="#footer" text="playground" onLinkClick={handleLinkClick} />
            </ul>

            <div className="navbar-toggle">
                <DarkModeToggle />
            </div>
        </motion.nav>
    );
};

export default Navbar;