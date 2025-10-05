import React from 'react';

const svgstrategy = (props) => (
  <svg 
    // KEEP THE VIEWBOX (Crucial for scaling)
    viewBox="0 0 583.48 583.48" 
    
    // Set a predictable size for the overall wrapper (this will override the viewBox's scaling in the DOM)
    width="150" 
    height="150"
    
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
      d="M291.74,497.54c-77.79,0-150.93-30.29-205.94-85.3C30.79,357.22.5,284.09.5,206.29S30.66,55.68,85.45.71l411.88,411.88c-54.97,54.79-127.96,84.95-205.59,84.95Z"
      style={{ fill: '#f1d145ff', stroke: '#ffffffff', strokeWidth: 0 }} // Force a visible fill color
    />
    
    {/* 2. TEXT LABEL 
          We use clean X/Y positioning (mid-point of 583.48 is ~292) and explicit styles.
    */}
    <text 
      x="350" 
      y="0" 
      transform="rotate(45)"
      textAnchor="middle" // Center the text horizontally
      dominantBaseline="central" // Center the text vertically
      
      style={{ 
        fontFamily: 'Inter, sans-serif', // Use a web-safe font or ensure 'Inter-Regular' is loaded
        fontSize: '100', 
        fill: '#343434ff',
        fontWeight: 'regular' // Optional: make it stand out
      }}
    >
      strategy
    </text>
  </svg>
);


export default svgstrategy;