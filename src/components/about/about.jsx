import React from 'react';
import { domAnimation, LazyMotion, m } from "framer-motion";

import aboutImage from '../../assets/about-image.png'

function About() {
    return (
        <LazyMotion features={domAnimation}>
            <m.section 
                className="about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
            <div className="about-text">
                <h1>About Me</h1>
                <span>Hi there! I'm Bora from İstanbul, Türkiye.</span>
                <span>Whether I'm sketching out a new design or strumming away on my guitar, I'm always in my happy place. I love exploring new techniques and challenging myself to try new things.</span>
                <span>If you'd like to learn more about me or my work, feel free to contact me. I'd love to hear from you!</span>
                <ul>
                    <li><a href="">Instagram</a></li>
                    <li><a href="">Twitter</a></li>
                    <li><a href="">ArtStation</a></li>
                </ul>
            </div>
            <div className="about-image">
                <img src={aboutImage} alt=""/>
            </div>
            </m.section>
        </LazyMotion>
    )
}

export default About;