import React, { useState } from "react";
// 🛑 FIX 2: Import Router components 🛑
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

// Import all local components
import Header from "./components/Header";
import About from "./components/About";
import ProjectGallery from "./components/ProjectGallery";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProjectDetailView from "./components/ProjectDetailView";
// You may not need DarkModeToggle or SlideshowFrame for this file, but they are here if needed.
// import DarkModeToggle from "./components/DarkModeToggle";
// import SlideshowFrame from "./components/SlideshowFrame"; 
import Playground from './pages/Playground'; // The standalone page

import "./App.css";

// 🛑 FIX 3: Define MainPortfolioLayout component 🛑
// This component encapsulates all the elements you want to show on the '/' route.
const MainPortfolioLayout = () => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  return (
    <div>
      {/* Navbar goes outside the main scrollable content if it's fixed */}
      <Navbar /> 
      
      {/* Header is inside the layout now. If Navbar and Header look the same,
        you might only need one, but keeping both based on your original code.
      */}
      <Header />
      
      <div className="content-wrapper">
        <div className="main">
          
          <ProjectGallery setSelectedProjectId={setSelectedProjectId} />
          <ProjectDetailView
            projectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
          />
          <About />
          
          {/* Footer /> */}
        </div>
      </div>
    </div>
  );
}


// 🛑 FIX 1: Export a single App function that sets up the router 🛑
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
{/* Route 1: Home Page */}
        <Route path="/" element={<MainPortfolioLayout />} />
        
        {/* Route 2: Standalone Playground Page - TEMPORARILY DISABLED */}
        {/* <Route path="/playground" element={<Playground />} /> */}
        
      </Routes>
    </BrowserRouter>
  );
}