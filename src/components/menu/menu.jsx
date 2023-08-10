import { useState } from "react";

function menu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="menu-container">
            <div className="menu-button" onClick={toggleMenu}>
                <svg width="24" height="8" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H24V1.77778H0V0Z" fill="white" />
                    <path d="M0 6.22222H16V8H0V6.22222Z" fill="white" />
                </svg>
                <span>Menu</span>
            </div>
            {isMenuOpen && (
                <div className="dropdown-menu">
                    <ul>
                        <li>Home</li>
                        <li>Artworks</li>
                        <li>About</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default menu;