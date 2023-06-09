import React, { useState } from "react";
import { motion , domAnimation, LazyMotion, m } from "framer-motion"

import { NavLink } from "react-router-dom";

import menuImage from "../../assets/menu-image.png";
import Hover1 from "../../assets/hover-1.svg";
import Hover2 from "../../assets/hover-2.svg";
import Hover3 from "../../assets/hover-3.svg";


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseEnter2 = () => {
    setIsHovered2(true);
  };
  const handleMouseEnter3 = () => {
    setIsHovered3(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleMouseLeave2 = () => {
    setIsHovered2(false);
  };
  const handleMouseLeave3 = () => {
    setIsHovered3(false);
  };

  const show = {
    opacity: 1,
    transition: {
      duration: 0,
    }
  };
  
  const hide = {
    opacity: 0,
    transition: {
      duration: 0,
    }
    
  };

  return (
    <LazyMotion features={domAnimation}>
      <header>
          <m.p>Bora Beşiktepe</m.p>
          <m.div className="menu-button" onClick={handleToggle}>
              <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H18V2H0V0ZM0 7H12V9H0V7ZM0 14H18V16H0V14Z" fill="#E7E7E7"/>
              </svg>
            <span>Menu</span>
          </m.div>          
      </header>
      <m.div className="background"
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? "0%" : "-100%" }}
          transition={{ duration: 0 }}
          onClick={handleToggle}></m.div>
      <m.div
        className="menu"
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.3 }}
      >        
        <ul>
          <p>Bora Beşiktepe</p>
          <div className="menu-items">
            <m.li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <m.img src={Hover1} animate={isHovered ? show : hide} className="hover1 hov" />
                <NavLink to="/">ARTWORKS</NavLink>
            </m.li>
            <m.li onMouseEnter={handleMouseEnter2} onMouseLeave={handleMouseLeave2}>
              <m.img src={Hover2} animate={isHovered2 ? show : hide} className="hover2 hov" />
              <NavLink to="/about">ABOUT</NavLink>
            </m.li>
            <m.li onMouseEnter={handleMouseEnter3} onMouseLeave={handleMouseLeave3}>
              <m.img src={Hover3} animate={isHovered3 ? show : hide} className="hover3 hov" />
              <NavLink to="/">CONTACT</NavLink>
            </m.li>
          </div>
        </ul>
        <img src={menuImage}></img>
      </m.div>
    </LazyMotion>
  );
}

export default Navbar;
