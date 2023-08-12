import React from 'react';

import Menu from '../menu/menu.jsx';

const About = () => {

  return (
    <>
      <nav>
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
              <li><a href="https://github.com/borabesiktepe" target='_blank'>GitHub</a></li>
              <li><a href="https://www.artstation.com/borabesiktepe" target='_blank'>ArtStation</a></li>
            </ul>
          </div>

          <p className='about-siteinfo'>This website was developed with the help of React.</p>
        </div>
      </div>

      <div className="about-background">
        <img src="https://media.tenor.com/el39oVPZlCIAAAAd/static-noise.gif"/>
      </div>
    </>
  );

};

export default About;
