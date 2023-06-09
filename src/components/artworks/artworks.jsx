import React from "react";
import { domAnimation, LazyMotion, m } from 'framer-motion'

import ImagesComponent from "./images";

function Artworks () {
    return (
        <LazyMotion features={domAnimation}>
            <m.div 
                className="gallery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="gallery-row">
                    <ImagesComponent />
                </div>
            </m.div>
        </LazyMotion>
    )
}

export default Artworks;