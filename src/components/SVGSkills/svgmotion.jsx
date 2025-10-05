import React from 'react';

const svgmotion = (props) => (
  <svg 
    // KEEP THE VIEWBOX (Crucial for scaling)
    viewBox="0 0 583.48 583.48" 
    
    // Set a predictable size for the overall wrapper (this will override the viewBox's scaling in the DOM)
    width="100" 
    height="100"
    
    // Set a default fill/stroke color for your skill block
    fill="#000000" 
    stroke="#000000"
    
    {...props} // CRITICAL: Allows Framer Motion to control position/scale
  >
    {/* 1. MAIN BACKGROUND SHAPE (The larger circle/container) 
          We use the path with the largest 'd' attribute (the outer boundary).
          We're forcing a fill color here to ensure it appears.
    */}
    <path 
      d="M268.16,535.83c-16.93,0-32.85-6.59-44.82-18.56L19.06,312.98c-24.71-24.71-24.71-64.92,0-89.63L223.35,19.06C235.32,7.09,251.24.5,268.16.5s32.84,6.59,44.82,18.56l204.28,204.28c24.71,24.71,24.71,64.92,0,89.63l-204.28,204.28c-11.97,11.97-27.89,18.56-44.82,18.56Z"
      style={{ fill: '#2553c9ff', stroke: '#ffffff', strokeWidth: 0 }} // Force a visible fill color
    />
    
    {/* 2. TEXT LABEL 
          We use clean X/Y positioning (mid-point of 583.48 is ~292) and explicit styles.
    */}
    <text 
      x="260" 
      y="260" 
      textAnchor="middle" // Center the text horizontally
      dominantBaseline="central" // Center the text vertically
      
      style={{ 
        fontFamily: 'Inter, sans-serif', // Use a web-safe font or ensure 'Inter-Regular' is loaded
        fontSize: '100px', 
        fill: '#ffffffff',
        fontWeight: 'regular' // Optional: make it stand out
      }}
    >
      motion
    </text>
  </svg>
);


export default svgmotion;