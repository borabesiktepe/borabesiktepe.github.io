import React from "react";

import ImagesComponent from "./images";

function Artworks () {
    return (
        <>
            <div className="gallery">
                <div className="gallery-row">
                    <ImagesComponent />
                </div>
            </div>
        </>
    )
}

export default Artworks;