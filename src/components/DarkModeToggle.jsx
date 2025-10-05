// src/components/DarkModeToggle.js 

import React, { useState, useEffect } from "react";
import "./DarkModeToggle.css"; 

const THEME_KEY = "user-theme";

// Theme logic (Remains the same and is perfect)
const getInitialTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const DarkModeToggle = () => {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const handleToggle = () => {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    };

    const isChecked = theme === 'dark';

    return (
        // The main container is the LABEL
        <label className="theme-switch" htmlFor="dark-mode-input">
            
            {/* The hidden input drives the CSS state (:checked) */}
            <input 
                type="checkbox" 
                id="dark-mode-input"
                checked={isChecked} 
                onChange={handleToggle} 
                className="switch-checkbox" 
            />
            
            {/* The visual slider holds the sun/moon icons */}
            <span className="switch-slider">
                {/* The CSS will use this span for the knob and its ::before/::after for icons */}
            </span>
        </label>
    );
};

export default DarkModeToggle;