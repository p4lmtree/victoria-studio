import React, { useState, useEffect } from "react";
import DarkModeToggle from "./DarkModeToggle";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import "./Navbar.css";

// ── Smooth scroll ─────────────────────────────────────────────────────
const handleSmoothScroll = (e, targetId) => {
  e.preventDefault();
  const el = document.getElementById(targetId.substring(1));
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// ── Nav items ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: "#gallery-wrapper", text: "Work"           },
  { href: "#about",           text: "About"          },
  { href: "#footer",          text: "Playground"     },
];

// ── Animation variants ────────────────────────────────────────────────
const overlayVariants = {
  closed: {
    clipPath: "inset(0% 0% 100% 100%)",
    transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1], when: "afterChildren" },
  },
  open: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      duration: 0.6, ease: [0.76, 0, 0.24, 1],
      when: "beforeChildren", staggerChildren: 0.07, delayChildren: 0.25,
    },
  },
};

const itemVariants = {
  closed: { y: 28, opacity: 0 },
  open:   { y: 0,  opacity: 1, transition: { ease: [0.25, 1, 0.5, 1], duration: 0.65 } },
};

const metaVariants = {
  closed: { opacity: 0 },
  open:   { opacity: 1, transition: { delay: 0.45, duration: 0.4 } },
};

// ── Desktop link — reveal-from-left underline ─────────────────────────
// On hover a hairline slides out from the left under the text,
// then retreats to the right on mouse-leave. Clean, editorial.
const NavLink = ({ href, text }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <li>
      <a
        href={href}
        className="nav-link"
        onClick={(e) => handleSmoothScroll(e, href)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="nav-link-text">{text}</span>
        <motion.span
          className="nav-link-line"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{
            scaleX:   hovered ? 1 : 0,
            originX:  hovered ? 0 : 1,   // enters left→right, exits right→left
          }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        />
      </a>
    </li>
  );
};

// ── Main Navbar ───────────────────────────────────────────────────────
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  // Track dark mode
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDarkMode(document.documentElement.classList.contains("dark"))
    );
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // ── Scroll-driven frost effect ──────────────────────────────────────
  // backdrop-filter blur and a whisper-thin background tint.
  // No solid colour — just atmosphere.
  const { scrollYProgress } = useScroll();

  // Smooth the progress so the frost eases in gently
  const smoothed = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  const blurAmount  = useTransform(smoothed, [0, 0.08], [0,   12]);
  const bgOpacity   = useTransform(smoothed, [0, 0.08], [0, isDarkMode ? 0.45 : 0.55]);
  const borderOpacity = useTransform(smoothed, [0, 0.08], [0, 0.08]);

  // We drive backdrop-filter via a CSS variable because Framer Motion
  // can't animate backdrop-filter directly — we update it in a useEffect.
  const navRef = React.useRef(null);

  useEffect(() => {
    const unsubBlur = blurAmount.on("change", (v) => {
      if (navRef.current) {
        navRef.current.style.backdropFilter    = `blur(${v}px) saturate(1.4)`;
        navRef.current.style.webkitBackdropFilter = `blur(${v}px) saturate(1.4)`;
      }
    });
    return () => unsubBlur();
  }, [blurAmount]);

  // Build the background rgba dynamically for dark/light
  const bgColor = isDarkMode
    ? useTransform(bgOpacity, (o) => `rgba(18,18,18,${o})`)
    : useTransform(bgOpacity, (o) => `rgba(255,255,255,${o})`);

  const borderBottomColor = isDarkMode
    ? useTransform(borderOpacity, (o) => `rgba(255,255,255,${o})`)
    : useTransform(borderOpacity, (o) => `rgba(0,0,0,${o})`);

  return (
    <>
      <motion.nav
        ref={navRef}
        className="navbar"
        style={{
          backgroundColor: bgColor,
          borderBottomColor,
        }}
      >
        <h1 className="navbar-title">Victoria Plasteig Studio</h1>

        {/* Desktop links */}
        <ul className="navbar-links">
          {NAV_ITEMS.map(({ href, text }) => (
            <NavLink key={href} href={href} text={text} />
          ))}
        </ul>

        <div className="navbar-right">
          <DarkModeToggle />
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

      {/* ── Mobile overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="mobile-menu-topbar">
              <span className="mobile-menu-logo">Victoria Plasteig Studio</span>
              <button
                className="mobile-menu-close"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <span className="close-icon" />
              </button>
            </div>

            <nav className="mobile-menu-nav" aria-label="Mobile navigation">
              <ol className="mobile-menu-list">
                {NAV_ITEMS.map(({ href, text }, i) => (
                  <motion.li
                    key={href}
                    className="mobile-menu-item"
                    variants={itemVariants}
                  >

                    <a
                      href={href}
                      className="mobile-menu-link"
                      onClick={(e) => {
                        handleSmoothScroll(e, href);
                        setIsMenuOpen(false);
                      }}
                    >
                      {text}
                    </a>
                    <motion.div className="mobile-menu-item-line" variants={metaVariants} />
                  </motion.li>
                ))}
              </ol>
            </nav>

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
