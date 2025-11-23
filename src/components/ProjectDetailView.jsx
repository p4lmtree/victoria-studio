import React, { useRef, useState, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import { projectData } from "../data/projectData";
import "./ProjectDetailView.css";

// --- (KeywordPill and ScrollInImage components remain UNCHANGED) ---

const KeywordPill = ({ text }) => {
  // Define the path data for a rough, hand-drawn oval/circle.
  // This path is designed to be slightly larger than the 100x40 viewBox.
  const FREEFORM_PATH = 
    "M2.72,72.5c-6.25,53,13.44,69.67,17.27,72.67,36.28,28.42,126.65-12.35,146.06-72.67,1.32-4.11,12.31-39.78-5.76-59-21.65-23.04-72.89-9.54-102.89,12.23-25.62,18.59-36.62,43.87-41.01,56.12"; // A rough oval

  // Get the length of this specific path. 
  // We'll approximate the length here since a direct calculation is complex.
  // A safe, large number that covers the path length is fine for strokeDasharray.
  const STROKE_LENGTH = 1000; 

  const drawVariants = {
    initial: {
      strokeDashoffset: STROKE_LENGTH,
      opacity: 0 // Slightly visible before draw
    },
    hover: {
      strokeDashoffset: 0,
      opacity: 1,
      transition: {
        duration: 0.5, // Slowed down slightly for a more "drawing" feel
        ease: "easeInOut" // Smoother draw
      }
    }
  };

  return (
    <motion.span
      className="keyword-item"
      whileHover="hover" 
      initial="initial" 
    >
      <motion.svg
        className="keyword-svg freeform" // 🔥 Added 'freeform' class for custom size
        viewBox="-5 -5 110 50" // 🔥 Expanded viewBox to give the path room to draw outside
        preserveAspectRatio="none" 
      >
        <motion.path
          className="svgpath"
          d={FREEFORM_PATH} // 🔥 Replaced rect with this custom freeform path
          fill="none"
          stroke="rgba(17, 17, 17, 0.7)" 
          strokeLinecap="round" // Gives the stroke a softer, hand-drawn end
          strokeWidth="2" // 🔥 Thicker stroke for visibility
          
          strokeDasharray={STROKE_LENGTH} 
          variants={drawVariants} 
        />
      </motion.svg>
      
      <span className="keyword-text">{text}</span>
    </motion.span>
  );
};

// 🔥 2. Create the Image Component with Scroll-In Effect 🔥
const ScrollInImage = ({ src, alt, className, delay = 0 }) => {
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = React.useState(false); 
  const animateTarget = hasAnimated ? "visible" : "hidden";

  React.useEffect(() => {
      const timer = setTimeout(() => {
          setHasAnimated(true);
      }, 500 + delay * 1000); 
      return () => clearTimeout(timer);
  }, [delay]);

  
  return (
    <motion.img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      variants={{
        // Corrected 'hidden' state to match your request (opacity 0, sliding from Y=30)
        hidden: { opacity: 0, scale: 1, y: 30 }, 
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { 
            duration: 0.8, 
            ease: [0.2, 0.6, 0.4, 1], 
            delay: delay 
          }
        }
      }}
      initial="hidden"
      animate={animateTarget} // Use the target that is controlled by scroll view
      whileHover={{ scale: 1.02 }}
      transition={{ type: "tween", duration: 0.2 }} // Use a quick tween instead of a spring

    />
  );
};


const ProjectDetailView = ({ projectId, setSelectedProjectId }) => {
  if (!projectId) return null;

  const project = projectData.find((p) => p.id === projectId);
  if (!project) return <div className="project-detail">Project not found.</div>;

  const [isExiting, setIsExiting] = useState(false);
  
  // 🔥 HYBRID FIX: State and Ref initialization 🔥
  const sectionRef = useRef(null);
  const [isSectionVisible, setIsSectionVisible] = useState(true); 

  // --- Framer Motion Exit Logic (UNCHANGED) ---
    useEffect(() => {
    if (isExiting) {
      // Wait for a time slightly longer than the longest exit animation (0.35s)
      const timer = setTimeout(() => {
        setSelectedProjectId(null);
        setIsExiting(false); // Reset state for future use
      }, 350); 
      return () => clearTimeout(timer);
    }
  }, [isExiting, setSelectedProjectId]);

  // 🔥 HYBRID FIX: Intersection Observer to track section visibility 🔥
  useEffect(() => {
    // Only run the observer once the section is mounted
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Sets to false when the project view scrolls off the screen
        setIsSectionVisible(entry.isIntersecting); 
      },
      { 
        root: null, // viewport
        threshold: 0.01 // Trigger when any small part leaves/enters
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      // Clean up observer on unmount
      observer.disconnect();
    };
  }, [projectId]); // Re-run effect when the projectId changes (i.e., new project mounts)

  const currentAnimate = isExiting ? "exit" : "visible";

  const handleClose = () => {
    setIsExiting(true); // Triggers the exit animation state
  };

  return (
    <AnimatePresence>
      <motion.section
        key={projectId}
        id="project-detail-view"
        className="project-detail"
        initial="hidden" // Use initial prop
        animate={currentAnimate} // Use custom animation state
        variants={{
          hidden: { opacity: 0, y: 60 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.8, 0.25, 1] } },
          // When isExiting is true, this 'exit' variant is played
          exit: { opacity: 0, y: 60, transition: { duration: 0.35, ease: [0.25, 0.8, 0.25, 1] } }
        }}
        ref={sectionRef} // 🔥 Attach ref to the main section 🔥
      >

        <div className="detail-grid">
          {/* Left column */}
          <motion.aside
            className="meta-column"
            variants={{
              hidden: { x: -40, opacity: 0 },
              visible: { x: 0, opacity: 1, transition: { duration: 0.3, delay: 0.05 } },
              exit: { x: -40, opacity: 0, transition: { duration: 0.3, delay: 0 } }
            }}
          >

                    <motion.button
          className="close-btn"
          onClick={handleClose} 
          variants={{
            hidden: { scale: 0 },
            visible: { scale: 1.5, rotate: 90, transition: { type: "spring", stiffness: 200, damping: 15, duration: 0.2 } },
            exit: { scale: 0, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 15, duration: 0.2 } }
          }}
          data-position={isSectionVisible ? 'fixed' : 'absolute'} 
        >
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        className="close-icon-svg"
    >
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" d="M18 6L6 18M6 6l12 12"/>
    </svg>
    
            </motion.button>

            {/* ... (Meta content is fully preserved) ... */}
            <h1 className="meta-title">{project.title}</h1>
            {project.subtitle && <p className="meta-sub">{project.subtitle}</p>}
            {project.keywords && (
              <div className="meta-keywords">
                {project.keywords.map((k, i) => (<KeywordPill key={i} text={k} />))}
              </div>
            )}
            {project.date && <div className="meta-date">{project.date}</div>}
          </motion.aside>

          {/* Right column */}
          <motion.div
            className="content-column"
            variants={{
              hidden: { x: 40, opacity: 0 },
              visible: { x: 0, opacity: 1, transition: { duration: 0.3, delay: 0 } },
              exit: { x: 40, opacity: 0, transition: { duration: 0.3, delay: 0 } }
            }}
          >
        
            {/* The project content mapping logic is fully preserved */}
            {project.content ? (
              project.content.map((block, idx) => {
                if (block.type === "text" || block.type === "intro") {
                  return (
                    <motion.div
                      key={idx}
                      className={block.type === "text" ? "text-block" : "intro-block"}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <p>{block.value}</p>
                    </motion.div>
                  );
                }
                
                // 🔥 Image loading logic is here and preserved 🔥
                if (block.type === "collage") {
                  return (
                    <motion.div
                      key={idx}
                      className="collage-wrap"
                    >
                      <div className="collage">
                        {block.slides.map((src, i) => (
                          <ScrollInImage
                            key={i}
                            src={src}
                            alt={`collage ${i}`}
                            className={`collage-item image-${i}`}
                            delay={i * 0.1}
                          />
                        ))}
                      </div>
                    </motion.div>
                  );
                }
                
                if (block.type === "image") {
                  return (
                    <div key={idx} className="single-image">
                      <ScrollInImage src={block.src} alt={`single ${idx}`} />
                    </div>
                  );
                }
                return null;
              })
            ) : (
              // 🔹 Old fallback (fully preserved)
              <>
                <div className="main-text">
                  {project.description &&
                    project.description.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
                </div>
                {/* ... (rest of fallback content) ... */}
              </>
            )}
          </motion.div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

export default ProjectDetailView;