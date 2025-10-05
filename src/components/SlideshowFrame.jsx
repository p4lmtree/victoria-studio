import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./SlideshowFrame.css";

const SlideshowFrame = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  const goNext = () => setCurrent((prev) => (prev + 1) % slides.length);
  const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="slideshow-wrapper">
      <motion.div
        className="slideshow-main"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <img src={slides[current]} alt="" className="slide" />

        <button onClick={goPrev} className="slide-nav left">←</button>
        <button onClick={goNext} className="slide-nav right">→</button>
     
          <div className="dot-indicator">
  {slides.map((_, index) => (
    <div
      key={index}
  className={`dot ${index === current ? "active" : ""}`}
  layout
/> ))}
</div>
        
      </motion.div>

      <div className="thumbnail-row">
        {slides.map((image, index) => (
          <div
            key={index}
            className={`thumbnail ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          >
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideshowFrame;
