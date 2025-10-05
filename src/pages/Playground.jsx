import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import space from "/images/1743874543239679.jpg"; 


// NOTE: Static Firebase imports have been removed to fix the local "Failed to resolve import" error.
// Firebase modules are now dynamically imported via CDN URLs inside the first useEffect hook below.

// --- STICKER ASSET DEFINITIONS ---
const STICKER_TEMPLATES = [
    {
        type: 'astronaut',
        width: 80,
        height: 80,
        content: `
            <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C13.88 4 15.68 4.67 17.07 5.83C18.46 6.99 19.4 8.57 19.78 10.37L17.75 11.58C17.43 10.03 16.51 8.71 15.22 7.82C13.93 6.93 12.4 6.5 10.82 6.5C9.24 6.5 7.71 6.93 6.42 7.82C5.13 8.71 4.21 10.03 3.89 11.58L1.86 10.37C2.24 8.57 3.18 6.99 4.57 5.83C5.96 4.67 7.76 4 9.64 4L12 4ZM10 18.5C10 17.67 9.33 17 8.5 17C7.67 17 7 17.67 7 18.5V19.5H17V18.5C17 17.67 16.33 17 15.5 17C14.67 17 14 17.67 14 18.5V19.5H10V18.5Z" fill="currentColor"/>
            </svg>
        `,
        paletteBg: 'bg-sky-100 hover:bg-sky-200',
        stickerBg: 'bg-sky-200/80',
        color: 'text-blue-600',
    },
    {
        type: 'planet',
        width: 90,
        height: 90,
        content: `
            <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M4 14C7.33333 15.3333 11.3333 16 15 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M3 10C6.33333 8.66667 10.3333 8 14 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `,
        paletteBg: 'bg-fuchsia-100 hover:bg-fuchsia-200',
        stickerBg: 'bg-fuchsia-200/80',
        color: 'text-purple-600',
    },
    {
        type: 'custom_png',
        width: 120,
        height: 120,
        content: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAASUlEQVR42u3BAQEAAACTKPYzLq4pWwAAAAAAAAAAAAAAAAAAAAAAAAAAYAEAAAEAAAAAAAAYAAABAAAAAAAAGAAAAQAAAAAAABgAAAEAAAAAAGAAAAAAMl2+0AEnF/9XqAAAAAElFTkSuQmCC" alt="Custom PNG Sticker" class="w-full h-full object-contain pointer-events-none" />',
        paletteBg: 'bg-amber-100 hover:bg-amber-200',
        stickerBg: 'bg-transparent',
        color: 'text-gray-900',
    }
];

// --- BACKGROUND IMAGE DEFINITIONS ---
const BACKGROUND_TEMPLATES = [
    { id: 'space', src: 'images/1743874543239679.jpg', name: 'Deep Space' },
    { id: 'desert', url: 'https://placehold.co/800x600/d97706/fcd34d?text=Desert+Sunset', name: 'Desert Sunset' },
    { id: 'forest', url: 'https://placehold.co/800x600/064e3b/a7f3d0?text=Alien+Forest', name: 'Alien Forest' },
    { id: 'abstract', url: 'https://placehold.co/800x600/3b0764/e9d5ff?text=Abstract+Warp', name: 'Abstract Warp' },
];
// --- END ASSET DEFINITIONS ---


// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Custom Modal Component (Replaces window.confirm/alert)
const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full transition transform duration-300 scale-100">
                <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                    )}
                    {onConfirm && (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


// Main Application Component (Playground)
const Playground = () => { 
    // Postcard Content State
    const [stickers, setStickers] = useState([]);
    const [backgroundTemplate, setBackgroundTemplate] = useState(BACKGROUND_TEMPLATES[0]);

    // Dragging State
    const [activeStickerId, setActiveStickerId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isDraggingFromPalette, setIsDraggingFromPalette] = useState(false);
    const [ghostSticker, setGhostSticker] = useState(null);
    
    // UI State
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [modal, setModal] = useState({ 
        isOpen: false, 
        idToDelete: null,
        title: '',
        message: '',
    });

    // Firebase State
    const firebaseModules = useRef({});
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Refs to hold DOM elements and transient drag data
    const canvasRef = useRef(null);
    const dragOffset = useRef({ x: 0, y: 0 });

    const stickerBeingDragged = stickers.find(s => s.id === activeStickerId) || ghostSticker;

    // Function to show transient messages (success/error)
    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    // --- FIREBASE INITIALIZATION AND AUTH (Updated for dynamic CDN imports) ---
    useEffect(() => {
        const loadFirebase = async () => {
            try {
                // Dynamic imports from CDN URLs
                const [appModule, authModule, firestoreModule] = await Promise.all([
                    import("https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js"),
                    import("https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js"),
                    import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js")
                ]);
                
                // Store module functions for later use
                firebaseModules.current = {
                    ...firestoreModule, // getFirestore, collection, addDoc, serverTimestamp
                    ...authModule,      // getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged
                    ...appModule        // initializeApp
                };

                const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
                const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
                const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

                if (Object.keys(firebaseConfig).length === 0) {
                    console.error("Firebase config is missing.");
                    return;
                }

                const app = firebaseModules.current.initializeApp(firebaseConfig);
                const firestore = firebaseModules.current.getFirestore(app);
                const currentAuth = firebaseModules.current.getAuth(app);
                
                setDb(firestore);
                setAuth(currentAuth);

                firebaseModules.current.onAuthStateChanged(currentAuth, (user) => {
                    if (user) {
                        setUserId(user.uid);
                    } else {
                         // Fallback for when the token check is complete and no user is found
                         setUserId('anonymous-user');
                    }
                    setIsAuthReady(true);
                });

                // Handle Authentication
                const authenticate = async () => {
                    try {
                        if (initialAuthToken) {
                            await firebaseModules.current.signInWithCustomToken(currentAuth, initialAuthToken);
                        } else {
                            await firebaseModules.current.signInAnonymously(currentAuth);
                        }
                    } catch (e) {
                        console.error("Authentication failed, signing in anonymously:", e);
                        await firebaseModules.current.signInAnonymously(currentAuth);
                    }
                };
                
                // This ensures we attempt auth immediately
                authenticate(); 

            } catch (error) {
                console.error("Firebase initialization failed:", error);
            }
        };

        loadFirebase();
    }, []);

    // --- FIRESTORE SAVE LOGIC ---
    const savePostcard = async () => {
        const { collection, addDoc, serverTimestamp } = firebaseModules.current;
        
        if (!isAuthReady || !db || stickers.length === 0 || !userId || !collection) {
            showMessage("Cannot save: Not authenticated, or no stickers placed.", 'error');
            return;
        }

        setIsSaving(true);
        try {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            
            // Collection path for public data: /artifacts/{appId}/public/data/postcards
            const postcardsCollection = collection(db, `artifacts/${appId}/public/data/postcards`);
            
            // Prepare data: only store necessary properties, excluding SVG content for smaller documents
            const stickerData = stickers.map(s => ({
                id: s.id,
                x: s.x,
                y: s.y,
                type: s.type,
                width: s.template.width,
                height: s.template.height,
                stickerBg: s.template.stickerBg,
            }));

            await addDoc(postcardsCollection, {
                userId: userId,
                backgroundImageUrl: backgroundTemplate.url, // Save the selected image URL
                stickers: JSON.stringify(stickerData), // Serialize to handle complex object arrays safely
                createdAt: serverTimestamp(),
            });

            showMessage("Postcard saved successfully!", 'success');
        } catch (e) {
            console.error("Error adding document: ", e);
            showMessage("Failed to save postcard. See console for details.", 'error');
        } finally {
            setIsSaving(false);
        }
    };


    // --- DRAG HANDLERS ---
    const getPos = useCallback((e) => {
        if (e.touches) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }, []);

    const handleCanvasDragStart = useCallback((e, id) => {
        if (e.button !== 0 && !e.touches) return;

        const stickerElement = e.currentTarget;
        const stickerRect = stickerElement.getBoundingClientRect();
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const pos = getPos(e);

        dragOffset.current = {
            x: pos.x - stickerRect.left,
            y: pos.y - stickerRect.top,
            canvasLeft: canvasRect.left,
            canvasTop: canvasRect.top,
            stickerWidth: stickerRect.width,
            stickerHeight: stickerRect.height,
        };

        setActiveStickerId(id);
        setIsDragging(true);
        if (e.touches) { e.preventDefault(); }
    }, [getPos]);

    const handlePaletteDragStart = useCallback((e, template) => {
        if (e.button !== 0 && !e.touches) return;
        if (!canvasRef.current) return;

        const pos = getPos(e);
        const canvasRect = canvasRef.current.getBoundingClientRect();

        setGhostSticker({
            id: generateId(),
            type: template.type,
            template: template,
            x: pos.x - canvasRect.left - template.width / 2, 
            y: pos.y - canvasRect.top - template.height / 2,
        });

        dragOffset.current = {
            x: template.width / 2,
            y: template.height / 2,
            canvasLeft: canvasRect.left,
            canvasTop: canvasRect.top,
            stickerWidth: template.width,
            stickerHeight: template.height,
        };
        
        setIsDraggingFromPalette(true);
        if (e.touches) { e.preventDefault(); }
    }, [getPos]);


    const handleDragMove = useCallback((e) => {
        if (!isDragging && !isDraggingFromPalette) return;
        
        const currentSticker = stickerBeingDragged;
        if (!currentSticker || !canvasRef.current) return;

        const pos = getPos(e);
        const { x, y, canvasLeft, canvasTop, stickerWidth, stickerHeight } = dragOffset.current;
        const canvasRect = canvasRef.current.getBoundingClientRect(); 

        let newX = pos.x - canvasLeft - x;
        let newY = pos.y - canvasTop - y;

        // Boundary checks 
        newX = Math.max(0, newX);
        newX = Math.min(canvasRect.width - stickerWidth, newX);
        newY = Math.max(0, newY);
        newY = Math.min(canvasRect.height - stickerHeight, newY);
        
        if (isDragging) {
            setStickers(prev => prev.map(s => 
                s.id === activeStickerId ? { ...s, x: newX, y: newY } : s
            ));
        } else if (isDraggingFromPalette) {
            setGhostSticker(prev => prev ? { ...prev, x: newX, y: newY } : null);
        }
        
        if (e.touches) {
            e.preventDefault();
        }

    }, [isDragging, isDraggingFromPalette, activeStickerId, stickerBeingDragged, getPos]);


    const handleDragEnd = useCallback(() => {
        if (!isDragging && !isDraggingFromPalette) return;
        
        if (isDraggingFromPalette && ghostSticker) {
            setStickers(prev => [...prev, ghostSticker]);
        }

        setIsDragging(false);
        setActiveStickerId(null);
        setGhostSticker(null);
        setIsDraggingFromPalette(false);
    }, [isDragging, isDraggingFromPalette, ghostSticker]);


    const showDeleteModal = useCallback((e, id) => {
        e.preventDefault(); 
        
        setModal({
            isOpen: true,
            idToDelete: id,
            title: 'Confirm Deletion',
            message: 'Are you sure you want to remove this sticker from the postcard? (Right-click/Long-press detected)',
        });
    }, []);

    const confirmDelete = useCallback(() => {
        setStickers(prev => prev.filter(s => s.id !== modal.idToDelete));
        setModal({ isOpen: false, idToDelete: null, title: '', message: '' });
        showMessage("Sticker deleted.", 'error');
    }, [modal.idToDelete]);

    const cancelDelete = useCallback(() => {
        setModal({ isOpen: false, idToDelete: null, title: '', message: '' });
    }, []);


    useEffect(() => {
        if (isDragging || isDraggingFromPalette) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleDragMove, { passive: false });
            window.addEventListener('touchend', handleDragEnd);
        } else {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove, { passive: false });
            window.removeEventListener('touchend', handleDragEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove, { passive: false });
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging, isDraggingFromPalette, handleDragMove, handleDragEnd]);
    
    // --- Render Components ---

    const Sticker = React.memo(({ sticker, isGhost = false }) => {
        const { id, x, y, template } = sticker;
        const isActive = activeStickerId === id;

        return (
            <div
                className={`absolute rounded-xl shadow-md transition-all duration-100 ease-out 
                            ${template.stickerBg} ${template.color}
                            ${isActive ? 'z-50 cursor-grabbing shadow-2xl ring-4 ring-fuchsia-500 scale-[1.05]' : 'z-10 cursor-grab hover:shadow-lg'}
                            ${isGhost ? 'opacity-70 border-2 border-dashed border-gray-500/50 scale-100' : ''}
                        `}
                style={{
                    left: x,
                    top: y,
                    width: template.width,
                    height: template.height,
                    transform: `translate(0px, 0px)`,
                    touchAction: 'none',
                }}
                onMouseDown={!isGhost ? (e) => handleCanvasDragStart(e, id) : undefined}
                onTouchStart={!isGhost ? (e) => handleCanvasDragStart(e, id) : undefined}
                onContextMenu={!isGhost ? (e) => showDeleteModal(e, id) : undefined}
                dangerouslySetInnerHTML={{ __html: template.content }}
            />
        );
    });

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-50 font-inter">
            
            {/* Custom Modal UI */}
            <Modal 
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            {/* Internal CSS block */}
            <style>{`
                .postcard-canvas {
                    min-height: 550px;
                    border: 2px solid #fff2e8ff;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                }
                .bg-thumbnail {
                    background-size: cover;
                    background-position: center;
                }
            `}</style>
            
            {/* Prominent Back Navigation Bar */}
            <nav className="mb-6">
                <Link 
                    to="/" 
                    className="
                        inline-flex items-center 
                        text-xl font-bold text-gray-700 hover:text-gray-900 
                        transition-colors duration-200 
                        p-2 -ml-2 rounded-lg
                    "
                >
                    <span className="text-3xl mr-2">←</span> 
                    Back
                </Link>
            </nav>

            <header className="mb-8 text-center">
                <h1 className="text-5xl text-gray-900 mb-2">
                    <span className="text-gray-900">i thought a postcard could be nice</span>
                </h1>
                <p className="text-lg text-gray-600">
                    -
                </p>
            </header>
            
            <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
                {/* Tools Sidebar */}
                <div className="lg:w-1/4 p-4 bg-white rounded-xl shadow-lg border border-gray-100 h-fit order-2 lg:order-1">
                    
                    {/* Sticker Palette */}
                    <h3 className="text-xl mb-4 text-gray-800 border-b pb-2">
                        choose your fighter
                    </h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {STICKER_TEMPLATES.map((template) => (
                            <div
                                key={template.type}
                                onMouseDown={(e) => handlePaletteDragStart(e, template)}
                                onTouchStart={(e) => handlePaletteDragStart(e, template)}
                                onClick={() => {
                                    if (isAuthReady) {
                                        setStickers(prev => [...prev, {
                                            id: generateId(),
                                            type: template.type,
                                            x: 100, y: 100, rotation: 0, template 
                                        }]);
                                    } else {
                                        showMessage("Please wait for authentication to complete.", 'error');
                                    }
                                }}
                                className={`w-20 h-20 p-2 rounded-xl flex items-center justify-center cursor-grab 
                                            transition duration-150 transform hover:scale-110 shadow-md
                                            ${template.paletteBg} ${template.color}
                                        `}
                            >
                                <div className="w-full h-full" 
                                     dangerouslySetInnerHTML={{ __html: template.content }} />
                            </div>
                        ))}
                    </div>

                    {/* Background Picker (Now uses Images) */}
                    <h3 className="text-xl mb-4 mt-6 text-gray-800 border-b pb-2">
                        where do we go?
                    </h3>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {BACKGROUND_TEMPLATES.map(bg => (
                            <button
                                key={bg.id}
                                onClick={() => setBackgroundTemplate(bg)}
                                className={`w-16 h-12 rounded-lg border- transition transform hover:scale-105 shadow-md bg-thumbnail
                                    ${backgroundTemplate.id === bg.id 
                                        ? 'border-beige-500 ring-2 ring-offset-2 ring-fuchsia-300' 
                                        : 'border-gray-300 hover:border-beige-400'
                                    }`}
                                style={{ backgroundImage: `url(${bg.url})` }}
                                title={bg.name}
                            >
                                <span className="sr-only">{bg.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Save Button */}
                    <div className="mt-6 border-t pt-4">
                        <button
                            onClick={savePostcard}
                            disabled={!isAuthReady || isSaving || stickers.length === 0}
                            className={`w-full py-3 rounded-lg text-white font-semibold transition-all shadow-lg
                                ${!isAuthReady || isSaving || stickers.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 active:scale-[0.98]'
                                }`}
                        >
                            {isSaving ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                'Save Postcard to Database'
                            )}
                        </button>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            User ID: {userId ? userId.substring(0, 8) : 'Authenticating...'}
                        </p>
                    </div>

                </div>

                {/* Postcard Canvas */}
                <div 
                    ref={canvasRef} 
                    className="flex-grow postcard-canvas rounded-sm relative overflow-hidden order-1 lg:order-2"
                    style={{ 
                        backgroundImage: `url(${backgroundTemplate.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {stickers.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-medium select-none pointer-events-none p-4 text-center bg-black/30">
                            Drag to add. Right-click/long-press to delete!
                        </div>
                    )}
                    
                    {stickers.map(sticker => (
                        <Sticker key={sticker.id} sticker={sticker} />
                    ))}
                    
                    {/* Render the ghost sticker during palette drag */}
                    {ghostSticker && <Sticker sticker={ghostSticker} isGhost={true} />}
                </div>
            </div>

            {/* Status Message */}
            {message.text && (
                <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-xl text-white transition-opacity duration-300 ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default Playground;
