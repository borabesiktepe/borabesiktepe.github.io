import React from "react";
import artwork1 from "../../assets/artwork-1.png"
import artwork2 from "../../assets/artwork-2.png"
import artwork3 from "../../assets/artwork-3.png"
import artwork4 from "../../assets/artwork-4.png"
import artwork5 from "../../assets/artwork-5.png"

const artworkList = [artwork1, artwork2, artwork3, artwork4, artwork5];

const ImagesComponent = () => {
    return (
        <>
            {artworkList.map((item, index) => (
                <div className="gallery-item" key={index}>
                    <img src={item}></img>
                </div>
            ))}
        </>
    );
}

export default ImagesComponent;