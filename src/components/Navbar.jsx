import React, { useState, useEffect } from "react"; // 🔥 Import useEffect
import ScribbleOnHover from "./ScribbleOnHover"; 
import DarkModeToggle from "./DarkModeToggle";
import { motion, useScroll, useTransform } from "framer-motion";
import "./Navbar.css";

// NavLinkWithScribble component (Replaced)

const handleSmoothScroll = (event, targetId) => {
    // 1. Prevent the browser's default choppy jump
    event.preventDefault(); 
    
    // 2. Remove the leading '#' to get the pure ID
    const elementId = targetId.substring(1); 
    
    // 3. Find the target element
    const targetElement = document.getElementById(elementId);
    
    if (targetElement) {
        // 4. Use the native scrollIntoView with smooth behavior
        targetElement.scrollIntoView({
            behavior: 'smooth',
            // optional: aligns the element to the top of the viewport
            block: 'start' 
        });
    }
};


const NavLinkWithScribble = ({ href, text }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <motion.li 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
        > 
            <a 
                href={href}
                // 🔥 ADDED onClick HANDLER 🔥
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
    
    // 🔥 1. Use state to track the theme. Initialize based on current class.
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains('dark')
    );
    
    // 🔥 2. Add an effect to listen for theme changes
    useEffect(() => {
        // Function to check and update the state
        const checkTheme = () => {
            const currentTheme = document.documentElement.classList.contains('dark');
            setIsDarkMode(currentTheme);
        };

        // MutationObserver watches for changes to the attributes of the <html> tag.
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    checkTheme();
                }
            }
        });

        // Start observing the <html> tag for attribute changes
        observer.observe(document.documentElement, { attributes: true });

        // Clean up the observer when the component unmounts
        return () => observer.disconnect();
    }, []); // Empty dependency array means this runs only on mount/unmount


    // 3. Define the colors using the reactive state variable
    const SCROLLED_BG_COLOR = isDarkMode 
      ? "rgba(17, 17, 17, 0.95)"
      : "rgba(255, 255, 255, 0.95)";
      
    const SCROLLED_BORDER_COLOR = isDarkMode 
      ? "#333"
      : "#ddd";


    // 4. Framer Motion Logic (remains the same, but now uses reactive constants)
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
            <ul className="navbar-links">
              <NavLinkWithScribble href="#gallery-wrapper" text="work" />
              <NavLinkWithScribble href="#about" text="about/contact" />
              <NavLinkWithScribble href="#footer" text="playground" />
            </ul>

            <div className="navbar-toggle">
                <DarkModeToggle />
            </div>
        </motion.nav>
    );
};

export default Navbar;