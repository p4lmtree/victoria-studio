import React from 'react';

const Svg3D = (props) => (
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
      d="M291.74,582.98c-77.79,0-150.93-30.29-205.94-85.3C30.79,442.67.5,369.54.5,291.74S30.79,140.81,85.8,85.8C140.81,30.79,213.95.5,291.74.5s150.93,30.29,205.94,85.3c55.01,55.01,85.3,128.15,85.3,205.94s-30.29,150.93-85.3,205.94c-55.01,55.01-128.15,85.3-205.94,85.3Z"
      style={{ fill: '#e23737ff', stroke: '#ffffffff', strokeWidth: 0 }} // Force a visible fill color
    />
    
    {/* 2. TEXT LABEL 
          We use clean X/Y positioning (mid-point of 583.48 is ~292) and explicit styles.
    */}
    <text 
      x="291.74" 
      y="291.74" 
      textAnchor="middle" // Center the text horizontally
      dominantBaseline="central" // Center the text vertically
      
      style={{ 
        fontFamily: 'Inter, sans-serif', // Use a web-safe font or ensure 'Inter-Regular' is loaded
        fontSize: '200', 
        fill: '#ffffffff',
        fontWeight: 'regular' // Optional: make it stand out
      }}
    >
      3d
    </text>
  </svg>
);


export default Svg3D;