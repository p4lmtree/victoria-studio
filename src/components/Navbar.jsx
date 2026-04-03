import React, { useState, useEffect } from "react";
import ScribbleOnHover from "./ScribbleOnHover";
import DarkModeToggle from "./DarkModeToggle";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import "./Navbar.css";

// ── Smooth scroll helper ──────────────────────────────────────────────
const handleSmoothScroll = (e, targetId) => {
  e.preventDefault();
  const el = document.getElementById(targetId.substring(1));
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// ── Nav items config ─────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: "#gallery-wrapper", text: "Work" },
  { href: "#about",           text: "About / Contact" },
  { href: "#footer",          text: "Playground" },
];

// ── Animation variants ───────────────────────────────────────────────

// Overlay panel: slides in from top-right corner
const overlayVariants = {
  closed: {
    clipPath: "inset(0% 0% 100% 100%)",  // collapsed to top-right corner
    transition: {
      duration: 0.55,
      ease: [0.76, 0, 0.24, 1],
      when: "afterChildren",
    },
  },
  open: {
    clipPath: "inset(0% 0% 0% 0%)",      // full screen
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1],
      when: "beforeChildren",
      staggerChildren: 0.07,
      delayChildren: 0.25,
    },
  },
};

// Each nav item: slides up from below
const itemVariants = {
  closed: { y: 24, opacity: 0 },
  open: {
    y: 0,
    opacity: 1,
    transition: { ease: [0.25, 1, 0.5, 1], duration: 0.6 },
  },
};

// Meta row (index numbers + bottom line)
const metaVariants = {
  closed: { opacity: 0 },
  open: {
    opacity: 1,
    transition: { delay: 0.45, duration: 0.4 },
  },
};

// ── Desktop NavLink ───────────────────────────────────────────────────
const NavLinkWithScribble = ({ href, text, onLinkClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.li
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onLinkClick}
    >
      <a
        href={href}
        onClick={(e) => handleSmoothScroll(e, href)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ScribbleOnHover isHovered={isHovered}>{text}</ScribbleOnHover>
      </a>
    </motion.li>
  );
};

// ── Main Navbar ───────────────────────────────────────────────────────
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  // Dark mode detection
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Scroll-based navbar bg
  const SCROLLED_BG = isDarkMode ? "rgba(17,17,17,0.95)" : "rgba(255,255,255,0.95)";
  const SCROLLED_BORDER = isDarkMode ? "#333" : "#ddd";

  const { scrollYProgress } = useScroll();
  const backgroundColor = useTransform(
    scrollYProgress, [0, 0.05], ["rgba(255,255,255,0)", SCROLLED_BG]
  );
  const borderColor = useTransform(
    scrollYProgress, [0, 0.05], ["transparent", SCROLLED_BORDER]
  );
  const borderWidth = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <>
      <motion.nav
        className="navbar"
        style={{ backgroundColor, borderColor, borderBottomWidth: borderWidth }}
      >
        <h1 className="navbar-title">Victoria Plasteig Studio</h1>

        {/* Desktop links */}
        <ul className="navbar-links">
          {NAV_ITEMS.map(({ href, text }) => (
            <NavLinkWithScribble key={href} href={href} text={text} />
          ))}
        </ul>

        <div className="navbar-right">
          <div className="navbar-toggle">
            <DarkModeToggle />
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen((p) => !p)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <span className={`hamburger ${isMenuOpen ? "open" : ""}`} />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile overlay menu ─────────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Top bar inside overlay — mirrors navbar height */}
            <div className="mobile-menu-topbar">
              <span className="mobile-menu-logo">Victoria Plasteig Studio</span>
              <button
                className="mobile-menu-close"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <span className="close-icon" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="mobile-menu-nav" aria-label="Mobile navigation">
              <ol className="mobile-menu-list">
                {NAV_ITEMS.map(({ href, text }, i) => (
                  <motion.li
                    key={href}
                    className="mobile-menu-item"
                    variants={itemVariants}
                  >
                    {/* Index number */}
                    <motion.span className="mobile-menu-index" variants={metaVariants}>
                      {String(i + 1).padStart(2, "0")}
                    </motion.span>

                    {/* Link */}
                    <a
                      href={href}
                      className="mobile-menu-link"
                      onClick={(e) => {
                        handleSmoothScroll(e, href);
                        closeMenu();
                      }}
                    >
                      {text}
                    </a>

                    {/* Bottom border line */}
                    <motion.div className="mobile-menu-item-line" variants={metaVariants} />
                  </motion.li>
                ))}
              </ol>
            </nav>

            {/* Footer row inside overlay */}
            <motion.div className="mobile-menu-footer" variants={metaVariants}>
              <span>©&thinsp;{new Date().getFullYear()}</span>
              <DarkModeToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
