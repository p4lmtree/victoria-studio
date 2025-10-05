import React from "react";
import { projectData } from "../data/projectData";
import "./ProjectGallery.css"; 

const ProjectGallery = ({ setSelectedProjectId }) => {
  return (
    <section className="gallery-wrapper" id="gallery-wrapper">
      <div className="gallery-container">
        {projectData.map((project) => {
          const previewImage =
            project.slides?.[0] || 
            project.image ||       
            "/images/placeholder.jpg"; 

          return (
            <div
              key={project.id}
              className="gallery-item-wrapper"
              // The click handler should ideally be on the button itself, 
              // but since the whole wrapper is clickable, we'll keep it here 
              // for now, and ensure the button's visual cue is strong.
              onClick={() => {
                setSelectedProjectId(project.id);
                document
                  .getElementById("project-detail-view")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              
              {/* Project title */}
              <div className="project-title">
                <div className="line"></div>
                <h3>{project.title}</h3>
              </div>

              {/* Preview image */}
              <div className="gallery-item">
                <img src={previewImage} alt={project.title} />
              </div>

              {/* 🔥 NEW: The 'More Info' Button 🔥 */}
<button
  title="View Project Details"
  className="more-info-button" // Positioning is already here
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="50px"
    height="50px"
    viewBox="0 0 24 24"
    className="more-info-icon" // New class for all styling
  >
    <path
      d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
      strokeWidth="1.5"
    ></path>
    <path d="M8 12H16" strokeWidth="1.5"></path>
    <path d="M12 16V8" strokeWidth="1.5"></path>
  </svg>
</button>

            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectGallery;