import React, { useState, useEffect } from 'react';
import "./darkmode.css"

const DarkModeToggle = () => {
  const [lightMode, setDarkMode] = useState(false);

  useEffect(() => {
    const islightModeEnabled = localStorage.getItem('lightModeEnabled');
    if (islightModeEnabled) {
      document.body.classList.add('light-mode');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    document.body.classList.toggle('light-mode');
    setDarkMode(!lightMode);

    if (!lightMode) {
      localStorage.setItem('lightModeEnabled', 'true');
    } else {
      localStorage.removeItem('lightModeEnabled');
    }
  };

  return (
    <button className="theme-button" onClick={toggleDarkMode}>        
        <div className={lightMode ? "theme-mode" : "theme-mode selected"}>DARK</div>
        <span>/</span>
        <div className={lightMode ? "theme-mode selected" : "theme-mode"}>LIGHT</div>
    </button>
  );
};

const DarkModeSwitch = () => {
  const [lightMode, setDarkMode] = useState(false);

  useEffect(() => {
    const islightModeEnabled = localStorage.getItem('lightModeEnabled');
    if (islightModeEnabled) {
      document.body.classList.add('light-mode');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    document.body.classList.toggle('light-mode');
    setDarkMode(!lightMode);

    if (!lightMode) {
      localStorage.setItem('lightModeEnabled', 'true');
    } else {
      localStorage.removeItem('lightModeEnabled');
    }
  };

  return (
    <label className="switch">
      <input type="checkbox" checked={lightMode} onChange={toggleDarkMode} />
      <span className="slider"></span>
    </label>
  );
};

export { DarkModeToggle, DarkModeSwitch }
