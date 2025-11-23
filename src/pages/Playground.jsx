import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
// Removed GSAP imports to rely on dynamic script loading and global access (window.gsap).

// Placeholder data for the media grid (replacing assets/medias/XX.png)
const MEDIA_ITEMS = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    type: `media-${i + 1}`,
    // Use diverse placeholder images for visual variety
    placeholderUrl: `https://placehold.co/150x150/${(i * 15 + 69).toString(16)}/ffffff?text=${(i+1)<10 ? '0' : ''}${i+1}`,
    alt: `Image ${i + 1}`
}));

// Placeholder data for placed stickers (optional, but keeps the canvas interactive)
const INITIAL_PLACED_STICKERS = [
    { id: 's1', x: 50, y: 50, content: '<img src="https://placehold.co/100x100/f87171/ffffff?text=Hello" class="w-full h-full object-contain pointer-events-none rounded-xl" />' },
];

/**
 * Utility function to dynamically load GSAP libraries via CDN.
 * This is necessary because this environment doesn't automatically load CDNs 
 * referenced in a React component's file.
 */
const loadGSAPScripts = (callback) => {
    // Check if GSAP is already loaded globally
    if (window.gsap && window.InertiaPlugin && window.Draggable) {
        callback();
        return;
    }

    const scriptsToLoad = [
        // GSAP Core
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
        // GSAP Plugins required for the effects
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/InertiaPlugin.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Draggable.min.js" 
    ];

    let loadedCount = 0;
    const totalScripts = scriptsToLoad.length;

    scriptsToLoad.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            loadedCount++;
            if (loadedCount === totalScripts) {
                // All scripts loaded, execute callback
                callback();
            }
        };
        script.onerror = () => {
            console.error(`Failed to load script: ${src}`);
        };
        document.head.appendChild(script);
    });
};


const Playground = () => { 
    // Refs for the GSAP elements
    const rootRef = useRef(null);
    const mediaContainerRef = useRef(null);
    const canvasRef = useRef(null);
    
    // Simple state for draggable stickers on the canvas
    const [placedStickers, setPlacedStickers] = useState(INITIAL_PLACED_STICKERS);
    const [isGSAPReady, setIsGSAPReady] = useState(false);

    // --- Placeholder Drag-to-Move Logic for Placed Stickers (RE-ENABLED) ---
    const handleStickerDrag = useCallback((e, id) => {
        const sticker = canvasRef.current.querySelector(`#${id}`);
        if (!sticker) return;

        // Use global references
        const g = window.gsap;
        const Draggable = window.Draggable;
        
        if (!g || !Draggable) {
            console.warn("GSAP Draggable plugin not available to enable drag-to-move.");
            return;
        }

        // We register Draggable in the main useEffect, but ensure it's available here too.
        
        // Use Draggable.create to enable drag-and-drop on the placed sticker
        const stickerDraggable = Draggable.create(sticker, {
            bounds: canvasRef.current,
            onDragStart: function() {
                g.to(this.target, { scale: 1.1, zIndex: 100, duration: 0.1 });
            },
            onDragEnd: function() {
                g.to(this.target, { scale: 1.0, zIndex: 1, duration: 0.1 });
            }
        });
        
        // If the click/touch event triggered the handler, start the drag immediately
        if (stickerDraggable.length > 0) {
            // Need a slight timeout to ensure Draggable fully initializes before starting the drag
            setTimeout(() => stickerDraggable[0].startDrag(e), 0);
        }
    }, []);

    // --- GSAP and Mouse Tracking Logic (Updated to wait for scripts) ---
    useEffect(() => {
        // Step 1: Load external scripts first
        loadGSAPScripts(() => {
            setIsGSAPReady(true);
        });
    }, []); 

    // Step 2: Run the core GSAP logic ONLY when scripts are ready
    useEffect(() => {
        if (!isGSAPReady) return; // Wait until scripts are loaded

        const g = window.gsap;
        const ip = window.InertiaPlugin;
        
        // Plugins are already registered inside loadGSAPScripts, but we register again for safety
        g.registerPlugin(ip, window.Draggable);

        const root = rootRef.current;
        const mediaElements = mediaContainerRef.current?.querySelectorAll('.media');

        if (!root || !mediaElements || mediaElements.length === 0) return;

        let oldX = 0, oldY = 0;
        let deltaX = 0, deltaY = 0;
        let isGSAPActive = false; // Flag to control GSAP listeners

        // 1. Mouse/Touch Tracking: Calculate movement delta
        const updateDelta = (e) => {
            // Check for touches array for touch events
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            deltaX = clientX - oldX;
            deltaY = clientY - oldY;

            oldX = clientX;
            oldY = clientY;
        };

        const handleMove = (e) => {
            if (isGSAPActive) {
                updateDelta(e);
            }
        };

        const handleTouchStart = (e) => {
            isGSAPActive = true;
            updateDelta(e); // Initialize oldX/oldY
        };

        const handleTouchEnd = () => {
            // Give a moment for the inertia to play out before disabling tracking
            setTimeout(() => { isGSAPActive = false; }, 300);
        };

        // Attach global move listeners
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("touchmove", handleMove, { passive: true });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchend", handleTouchEnd);


        // 2. Animation Application
        const applyAnimation = (el) => {
            const image = el.querySelector('img');
            
            // Check for significant delta to prevent spurious animations
            if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

            const tl = g.timeline({ // Use global GSAP reference (g)
                onComplete: () => tl.kill()
            });
            tl.timeScale(1.2); 

            // Tween 1: Inertial movement
            tl.to(image, {
                inertia: {
                    x: { velocity: deltaX * 30, end: 0 },
                    y: { velocity: deltaY * 30, end: 0 },
                },
                duration: 0.6
            });

            // Tween 2: Random rotation
            tl.fromTo(image, { rotate: 0 }, {
                duration: 0.4,
                rotate: (Math.random() - 0.5) * 30, 
                yoyo: true,
                repeat: 1,
                ease: 'power1.inOut'
            }, '<'); 
        };

        // Attach listeners to each media item using GSAP context for cleanup
        const ctx = g.context(() => { // Use global GSAP reference (g)
            mediaElements.forEach(el => {
                // Activate animation on hover (mouse) and click (touch/general)
                el.addEventListener('mouseenter', () => { isGSAPActive = true; applyAnimation(el); });
                el.addEventListener('mouseleave', () => { isGSAPActive = false; });
                el.addEventListener('click', () => { applyAnimation(el); });
            });
        }, root);


        // Cleanup function
        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchmove", handleMove);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
            ctx.revert();
        };

    }, [isGSAPReady]); // Re-run when GSAP is confirmed loaded

    // --- Render Components ---
    return (
        <div ref={rootRef} className="mwg_effect000-root min-h-screen bg-[#1a1a1a] font-[Inter]">
            
            {/* Custom CSS (Translated from the user's provided block) */}
            <style jsx="true">{`
                /* Essential styles that are hard to replicate with Tailwind alone (e.g., vw units) */
                .mwg_effect000-root {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-bottom: 2rem;
                }
                .mwg_effect000 .header {
                    /* Inherited user CSS */
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    position: sticky; /* Use sticky instead of absolute top 0 for better React flow */
                    top: 0;
                    width: 100%;
                    border-bottom: 1px solid #323232;
                    padding: 20px 25px;
                    color: #BAB8B9;
                    z-index: 10;
                    background-color: #1a1a1a;
                }
                .mwg_effect000 .header div:nth-child(2) { font-size: 26px; }
                .mwg_effect000 .header div:last-child { display: flex; justify-content: flex-end; }
                .mwg_effect000 .button {
                    font-size: 14px; text-transform: uppercase; border-radius: 24px;
                    height: 48px; gap: 5px; padding: 0 20px; display: flex; 
                    align-items: center; width: max-content; cursor: pointer;
                    transition: opacity 0.2s;
                }
                .mwg_effect000 .button1 { background-color: #232323; }
                .mwg_effect000 .button2 { border: 1px solid #323232; }

                /* Media Grid Specifics */
                .mwg_effect000 .medias {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1vw;
                    margin-top: 2rem;
                    width: 90vw; /* Keep it fluid */
                    max-width: 1000px; /* Optional max-width */
                }
                .mwg_effect000 .medias img {
                    width: 11vw;
                    height: 11vw;
                    object-fit: cover;
                    border-radius: 4%;
                    display: block;
                    pointer-events: none;
                    will-change: transform; /* Critical for smooth GSAP animation */
                    background-color: #333;
                }
                
                /* Postcard Canvas Styling */
                .postcard-canvas {
                    width: 90vw;
                    max-width: 800px;
                    min-height: 500px;
                    background-color: #f7f7f7;
                    border: 10px solid #fff;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    border-radius: 12px;
                    margin-top: 80px; /* Space below fixed header */
                    position: relative;
                    overflow: hidden;
                }

                @media (max-width: 768px) {
                    .mwg_effect000 .header { padding: 15px; display: flex; justify-content: space-between; }
                    .mwg_effect000 .header div:nth-child(2) { display: none; }
                    .mwg_effect000 .header div:nth-child(1) span { display: none; }
                    .mwg_effect000 .button { padding: 0 15px; height: 40px; }
                    .mwg_effect000 .medias {
                        gap: 2vw;
                        grid-template-columns: repeat(3, 1fr);
                    }
                    .mwg_effect000 .medias img {
                        width: 28vw;
                        height: 28vw;
                    }
                    .postcard-canvas {
                        min-height: 350px;
                    }
                }
            `}</style>

            {/* Top Navigation */}
            <div className="w-full max-w-4xl p-4 flex justify-between items-center">
                <Link 
                    to="/" 
                    className="inline-flex items-center text-xl font-bold text-gray-500 hover:text-white transition-colors duration-200 p-2 -ml-2 rounded-lg"
                >
                    <span className="text-3xl mr-2">←</span> Back
                </Link>
            </div>
            
            <h1 className="text-4xl font-extrabold text-white mb-8">Postcard Design Studio</h1>

            {/* 1. POSTCARD CANVAS (Above the grid) */}
            <div ref={canvasRef} className="postcard-canvas">
                {placedStickers.map(sticker => (
                    <div
                        key={sticker.id}
                        id={sticker.id}
                        className="absolute cursor-grab rounded-xl shadow-lg"
                        style={{ left: sticker.x, top: sticker.y, zIndex: 1 }}
                        onMouseDown={(e) => handleStickerDrag(e, sticker.id)}
                        onTouchStart={(e) => handleStickerDrag(e, sticker.id)}
                        dangerouslySetInnerHTML={{ __html: sticker.content }}
                    />
                ))}
                
                {placedStickers.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-2xl font-semibold select-none">
                        Drag items onto the canvas here.
                    </div>
                )}
            </div>

            {/* 2. HEADER BAR (Mimicking the GSAP example's top bar) */}
            <section className="mwg_effect000 w-full max-w-4xl mt-12">
                <div className="header w-full static md:fixed md:top-0 md:left-0 md:w-full">
                    <div>
                        <p className="button button1">
                            {/* Placeholder for the icon */}
                            <img src="https://placehold.co/22x22/232323/BAB8B9?text=3D" alt="3D icon"/>
                            <span>3d & stuff</span>
                        </p>
                    </div>
                    <div>{MEDIA_ITEMS.length} items available in collection</div>
                    <div>
                        <p className="button button2">Add more</p>
                    </div>
                </div>

                {/* 3. MEDIA GRID (The GSAP interactive section) */}
                <div ref={mediaContainerRef} className="medias">
                    {MEDIA_ITEMS.map(item => (
                        <div key={item.id} className="media cursor-pointer rounded-xl">
                            <img 
                                src={item.placeholderUrl} 
                                alt={item.alt}
                                // Setting explicit width/height ensures layout stability
                                width="150" 
                                height="150"
                                className="w-full h-full"
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Playground;
