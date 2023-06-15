import React from 'react';
import { domAnimation, LazyMotion, m } from "framer-motion";

import aboutImage from '../../assets/about-image.png'

function About() {
    return (
        <>
            <section 
                className="about"                
            >
            <div className="about-text">
                <h1>About Me</h1>
                <span>Greetings! I'm Bora from İstanbul, Türkiye.</span>
                <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus enim, iure architecto commodi praesentium illum voluptates ipsum recusandae eum odio incidunt a perferendis deleniti quam minima repellat assumenda et ab?</span>
                <ul>
                    <li><a href="https://www.instagram.com/borabesiktepe/" target='_blank'>Instagram</a></li>
                    <li><a href="https://twitter.com/borabesiktepe" target='_blank'>Twitter</a></li>
                    <li><a href="https://artstation.com/borabesiktepe" target='_blank'>ArtStation</a></li>
                </ul>
            </div>
            <div className="about-image">
                <img src={aboutImage} alt=""/>
            </div>
            </section>
        </>
    )
}

export default About;