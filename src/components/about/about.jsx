import { motion } from "framer-motion";

import SideNavigation from "../side-navigation";

const About = () => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SideNavigation />

      <div className="about-section">
        <div className="about-content">
          <p>Self-taught illustrator and developer from Istanbul, Türkiye.</p>

          <h1>ABOUT</h1>

          <div className="about-contacts">
            <p>Want to contact me?</p>
            <ul>
              <li><a href="mailto:borabesiktepe@gmail.com">borabesiktepe@gmail.com</a></li>
              <li><a href="https://www.instagram.com/borabesiktepe/" target='_blank' rel="noreferrer">Instagram</a></li>
              <li><a href="https://www.artstation.com/borabesiktepe" target='_blank' rel="noreferrer">ArtStation</a></li>
            </ul>
          </div>

          <p className='about-siteinfo'>© Bora Beşiktepe</p>
        </div>
      </div>
    </motion.div>
  );

};

export default About;
