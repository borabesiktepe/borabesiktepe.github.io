import React, { useState } from "react";
import { motion , domAnimation } from "framer-motion"

import { NavLink } from "react-router-dom";

import menuImage from "../../assets/menu-image.png";


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);    
    console.log('clicked:' + isOpen);
  };

  return (
    <>
      <header>
          <motion.p>Bora Beşiktepe</motion.p>
          <motion.div className="menu-button" onClick={handleToggle}>
              <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H18V2H0V0ZM0 7H12V9H0V7ZM0 14H18V16H0V14Z" fill="#E7E7E7"/>
              </svg>
            <span>Menu</span>
          </motion.div>          
      </header>
      <motion.div className="background"
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? "0%" : "-100%" }}
          transition={{ duration: 0 }}
          onClick={handleToggle}></motion.div>
      <motion.div
        className="menu"
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.3 }}
      >        
        <ul>
          <p>Bora Beşiktepe</p>
          <div className="menu-items">
            <li><NavLink to="/">ART-WORKS</NavLink></li>
            <li><NavLink to="/about">ABOUT</NavLink></li>
            <li><NavLink to="/">CONTACT</NavLink></li>
          </div>
        </ul>
        <img src={menuImage}></img>
      </motion.div>
    </>
  );
}

export default Navbar;
