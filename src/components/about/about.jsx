import React from 'react';
import { motion } from "framer-motion";

import Menu from '../menu/menu.jsx';
import {DarkModeSwitch} from '../darkmode';

const About = () => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav>
        <DarkModeSwitch></DarkModeSwitch>
        <Menu />
        <h1>BORA BEŞİKTEPE</h1>
      </nav>

      <div className="about-section">
        <div className="about-content">
          <p>Self-taught illustrator and developer from Istanbul, Türkiye.</p>

          <h1>ABOUT</h1>

          <div className="about-contacts">
            <p>Want to contact me?</p>
            <ul>
              <li><a href="mailto:borabesiktepe@gmail.com">borabesiktepe@gmail.com</a></li>
              <li><a href="https://www.instagram.com/borabesiktepe/" target='_blank'>Instagram</a></li>
              <li><a href="https://twitter.com/borabesiktepe" target='_blank'>Twitter</a></li>
              <li><a href="https://github.com/borabesiktepe" target='_blank'>GitHub</a></li>
              <li><a href="https://www.artstation.com/borabesiktepe" target='_blank'>ArtStation</a></li>
            </ul>
          </div>

          <p className='about-siteinfo'>This website was developed with the help of React.</p>
        </div>
      </div>      
      </motion.div>
  );

};

export default About;
