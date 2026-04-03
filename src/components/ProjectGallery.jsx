import React, { useState, useRef, useEffect, useCallback } from "react";
import { projectData } from "../data/projectData";
import "./ProjectGallery.css";

// ── Extracts the dominant color from an image via canvas ─────────────
// Returns an rgba string with low opacity for use as a color wash.
const extractDominantColor = (imgEl, opacity = 0.55) => {
  try {
    const canvas = document.createElement("canvas");
    // Sample a small version for speed
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgEl, 0, 0, 16, 16);
    const data = ctx.getImageData(0, 0, 16, 16).data;

    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      // Skip near-white and near-black pixels — they skew the average
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (brightness > 240 || brightness < 15) continue;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    if (count === 0) return `rgba(30,30,30,${opacity})`;
    return `rgba(${Math.round(r/count)},${Math.round(g/count)},${Math.round(b/count)},${opacity})`;
  } catch {
    // Canvas tainted by CORS — fall back gracefully
    return `rgba(30,30,30,${opacity})`;
  }
};

// ── Single gallery card ───────────────────────────────────────────────
const GalleryCard = ({ project, onSelect }) => {
  const [isHovered, setIsHovered]       = useState(false);
  const [dominantColor, setDominantColor] = useState("rgba(30,30,30,0.55)");
  const imgRef = useRef(null);

  const previewImage =
    project.slides?.[0] ||
    project.image ||
    "/images/placeholder.jpg";

  // Extract color once the image has loaded
  const handleImageLoad = useCallback(() => {
    if (imgRef.current) {
      setDominantColor(extractDominantColor(imgRef.current));
    }
  }, []);

  // If image was already cached and loaded before the handler attached
  useEffect(() => {
    if (imgRef.current?.complete) handleImageLoad();
  }, [handleImageLoad]);

  const tags   = project.tags   || project.categories || [];
  const year   = project.year   || "";
  const title  = project.title  || "Untitled";

  return (
    <div
      className={`gallery-item-wrapper ${isHovered ? "is-hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        onSelect(project.id);
        document
          .getElementById("project-detail-view")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
    >


      {/* ── Card ── */}
      <div className="gallery-item">

        {/* Base image — always visible */}
        <img
          ref={imgRef}
          src={previewImage}
          alt={title}
          className="gallery-img"
          onLoad={handleImageLoad}
          crossOrigin="anonymous"
        />

        {/* Hover overlay: blurred image + color wash + info ── */}
        <div
          className="gallery-hover-overlay"
          style={{ "--tint-color": dominantColor }}
        >
          {/* Blurred copy of the image as background */}
          <div
            className="gallery-hover-bg"
            style={{ backgroundImage: `url(${previewImage})` }}
          />

          {/* Color wash on top of the blur */}
          <div className="gallery-hover-tint" />

          {/* Info panel */}
          <div className="gallery-hover-info">
            {year && (
              <span className="gallery-hover-year">{year}</span>
            )}
            <h3 className="gallery-hover-title">{title}</h3>
            {tags.length > 0 && (
              <ul className="gallery-hover-tags" aria-label="Tags">
                {tags.map((tag) => (
                  <li key={tag} className="gallery-hover-tag">{tag}</li>
                ))}
              </ul>
            )}
            <span className="gallery-hover-cta" aria-hidden="true">
              View project ↗
            </span>
          </div>
        </div>

      </div>

      {/* More info button */}
      <button
        title="View Project Details"
        className="more-info-button"
        onClick={(e) => {
          e.stopPropagation(); // don't double-fire the wrapper click
          onSelect(project.id);
          document
            .getElementById("project-detail-view")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50px"
          height="50px"
          viewBox="0 0 24 24"
          className="more-info-icon"
        >
          <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" strokeWidth="1.5" />
          <path d="M8 12H16" strokeWidth="1.5" />
          <path d="M12 16V8" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  );
};

// ── Gallery section ───────────────────────────────────────────────────
const ProjectGallery = ({ setSelectedProjectId }) => (
  <section className="gallery-wrapper" id="gallery-wrapper">
    <div className="gallery-container">
      {projectData.map((project) => (
        <GalleryCard
          key={project.id}
          project={project}
          onSelect={setSelectedProjectId}
        />
      ))}
    </div>
  </section>
);

export default ProjectGallery;
